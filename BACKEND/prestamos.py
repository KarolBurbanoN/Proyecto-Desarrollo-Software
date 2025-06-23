from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
#--->Se agrego
import threading 
import time

from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS import models
from sqlalchemy.orm import Session
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

prestamos_bp = Blueprint("prestamos", __name__, url_prefix="/api/prestamos")

from flask import session

def requiere_autenticacion(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        usuario_id = session.get("usuario_id")

        if not usuario_id:
            return jsonify({"error": "No autorizado"}), 401

        return f(usuario_id, *args, **kwargs)
    return decorador

@prestamos_bp.route("/", methods=["POST"])
@requiere_autenticacion
def crear_prestamo(usuario_id):
    db: Session = next(get_db())
    data = request.get_json()
    
    # Validar datos
    if 'ISBN' not in data:
        return jsonify({"error": "Falta el ISBN del libro"}), 400
    
    try:
        # Buscar un ejemplar disponible
        ejemplar = db.query(models.Ejemplar).filter_by(
            ISBN=data['ISBN'],
            estado='disponible'
        ).first()
        
        if not ejemplar:
            return jsonify({"error": "No hay ejemplares disponibles"}), 400
        
        # Verificar si el usuario ya tiene este libro prestado
        prestamo_existente = db.query(models.Prestamo).filter_by(
            id_usuario=usuario_id,
            id_ejemplar=ejemplar.id_ejemplar,
            estado='activo'
        ).first()
        
        if prestamo_existente:
            return jsonify({"error": "Ya tienes este libro prestado"}), 400
        
        # Verificar si el usuario tiene sanciones activas
        sancion_activa = db.query(models.Sancion).filter(
            models.Sancion.id_usuario == usuario_id,
            models.Sancion.fecha_fin >= datetime.now().date()
        ).first()
        
        if sancion_activa:
            return jsonify({
                "error": "Tienes una sanción activa",
                "fecha_fin": sancion_activa.fecha_fin.strftime("%Y-%m-%d")
            }), 403
        
        # Crear préstamo
        nuevo_prestamo = models.Prestamo(
            id_usuario=usuario_id,
            id_ejemplar=ejemplar.id_ejemplar,
            fecha_prestamo=datetime.now().date(),
            fecha_vencimiento=datetime.now().date() + timedelta(days=15),
            estado='activo'
        )
        
        # Actualizar estado del ejemplar
        ejemplar.estado = 'prestado'
        
        db.add(nuevo_prestamo)
        
        # Marcar cualquier reserva notificada del usuario para este libro como completada
        reserva = db.query(models.Reserva).filter_by(
            id_usuario=usuario_id,
            ISBN=data['ISBN'],
            estado='notificado'
        ).first()

        if reserva:
            reserva.estado = 'completada'
        
        db.commit()
        
        return jsonify({
            "mensaje": "Préstamo realizado correctamente",
            "fecha_devolucion": nuevo_prestamo.fecha_vencimiento.strftime("%Y-%m-%d")
        }), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

@prestamos_bp.route("/usuario", methods=["GET"])
@requiere_autenticacion
def obtener_prestamos_usuario(usuario_id):
    db: Session = next(get_db())
    
    try:
        prestamos = db.query(models.Prestamo).join(models.Ejemplar).join(models.Libro).filter(
            models.Prestamo.id_usuario == usuario_id,
            models.Prestamo.estado == 'activo'
        ).all()
        
        return jsonify([{
            "id_prestamo": p.id_prestamo,
            "fecha_prestamo": p.fecha_prestamo.strftime("%Y-%m-%d"),
            "fecha_vencimiento": p.fecha_vencimiento.strftime("%Y-%m-%d"),
            "puede_resenar": getattr(p, "puede_resenar", True),  # por si no está en BD antigua
            "libro": {
                "ISBN": p.ejemplar.libro.ISBN,
                "titulo": p.ejemplar.libro.titulo,
                "autores": [{"nombre": a.nombre} for a in p.ejemplar.libro.autores],
                "portada": p.ejemplar.libro.portada
            }
        } for p in prestamos])

        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@prestamos_bp.route("/<int:id_prestamo>/devolver", methods=["POST"])
@requiere_autenticacion
def devolver_prestamo(usuario_id, id_prestamo):
    db: Session = next(get_db())
    
    try:
        # Obtener el préstamo
        prestamo = db.query(models.Prestamo).join(models.Ejemplar).filter(
            models.Prestamo.id_prestamo == id_prestamo,
            models.Prestamo.id_usuario == usuario_id,
            models.Prestamo.estado == 'activo'
        ).first()
        
        if not prestamo:
            return jsonify({"error": "Préstamo no encontrado"}), 404
        
        # Verificar si hay retraso
        fecha_devolucion = datetime.now().date()
        en_retraso = fecha_devolucion > prestamo.fecha_vencimiento
        dias_retraso = (fecha_devolucion - prestamo.fecha_vencimiento).days if en_retraso else 0
        
        # Crear registro de devolución
        nueva_devolucion = models.Devolucion(
            id_prestamo=prestamo.id_prestamo,
            fecha_devolucion=fecha_devolucion,
            en_retraso=en_retraso,
            dias_retraso=dias_retraso
        )
        
        # Actualizar estado del préstamo
        prestamo.estado = 'devuelto'
        
        # Actualizar estado del ejemplar
        prestamo.ejemplar.estado = 'disponible'
        
        # Notificar al siguiente en la cola de reservas
        reserva = db.query(models.Reserva).join(models.Libro).filter(
            models.Reserva.ISBN == prestamo.ejemplar.ISBN,
            models.Reserva.estado == 'pendiente'
        ).order_by(models.Reserva.fecha_reserva.asc()).first()

        if reserva:
            asunto = f"Tu reserva del libro '{reserva.libro.titulo}' está disponible"
            mensaje = f"""Hola {reserva.usuario.nombres},

        El libro que reservaste: {reserva.libro.titulo} ya está disponible.

        Ya puedes prestarlo.

        Biblioteca Alexandria
        """
            enviar_correo(reserva.usuario.correo, asunto, mensaje)

            # Solo si el correo se intentó enviar
            reserva.estado = "notificado"
            reserva.notificado = True
            db.commit()

        
        # Aplicar sanción si hay retraso
        if en_retraso:
            nueva_sancion = models.Sancion(
                id_usuario=usuario_id,
                motivo=f"Retraso en la devolución del libro {prestamo.ejemplar.libro.titulo}",
                fecha_inicio=fecha_devolucion,
                fecha_fin=fecha_devolucion + timedelta(days=min(dias_retraso * 2, 30))  # 2 días de sanción por cada día de retraso, máximo 30 días
            )
            db.add(nueva_sancion)
        
        db.add(nueva_devolucion)
        db.commit()
        
        mensaje = "Libro devuelto correctamente"
        if en_retraso:
            mensaje += f". Has recibido una sanción por {dias_retraso * 2} días."
        
        return jsonify({
            "mensaje": mensaje,
            "reserva_notificada": reserva is not None
        })
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    
# En prestamos.py, agrega esta nueva ruta:
@prestamos_bp.route("/<int:id_prestamo>/resena", methods=["POST"])
@requiere_autenticacion
def agregar_resena(usuario_id, id_prestamo):
    db: Session = next(get_db())
    data = request.get_json()
    
    try:
        # Verificar que el préstamo existe y pertenece al usuario
        prestamo = db.query(models.Prestamo).filter(
            models.Prestamo.id_prestamo == id_prestamo,
            models.Prestamo.id_usuario == usuario_id,
            models.Prestamo.puede_resenar == True
        ).first()
        
        if not prestamo:
            return jsonify({"error": "Préstamo no encontrado o no permite reseñas"}), 404
        
        # Validar calificación
        calificacion = data.get('calificacion')
        if not calificacion or not (1 <= calificacion <= 5):
            return jsonify({"error": "Calificación inválida (debe ser 1-5)"}), 400
        
        # Crear la reseña
        nueva_resena = models.Calificacion(
            ISBN=prestamo.ejemplar.libro.ISBN,
            id_usuario=usuario_id,
            estrellas=calificacion,
            comentario=data.get('comentario', '')
        )

        # Guardar primero la nueva reseña
        db.add(nueva_resena)
        db.flush()  # Asegura que esté en la sesión antes de la consulta

        # Calcular promedio incluyendo la nueva reseña
        libro = prestamo.ejemplar.libro
        calificaciones = db.query(models.Calificacion).filter_by(ISBN=libro.ISBN).all()
        if calificaciones:
            libro.promedio_calificacion = sum(c.estrellas for c in calificaciones) / len(calificaciones)
        else:
            libro.promedio_calificacion = calificacion  # primera reseña

        # Marcar como reseñado
        prestamo.puede_resenar = False

        
        db.add(nueva_resena)
        db.commit()
        
        return jsonify({"mensaje": "Reseña agregada correctamente"})
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

def enviar_correo(destinatario, asunto, mensaje):
    remitente = "alexandriabiblioteca611@gmail.com"  # Cambia por tu correo
    contraseña = "dvvj ijxx rpys reoz"  # Usa contraseña de aplicación si es Gmail

    msg = MIMEMultipart()
    msg['From'] = remitente
    msg['To'] = destinatario
    msg['Subject'] = asunto

    msg.attach(MIMEText(mensaje, 'plain'))

    try:
        servidor = smtplib.SMTP('smtp.gmail.com', 587)
        servidor.starttls()
        servidor.login(remitente, contraseña)
        servidor.send_message(msg)
        servidor.quit()
        print("Correo enviado a:", destinatario)
    except Exception as e:
        print("Error al enviar correo:", e)

    
#---> se agrego
@prestamos_bp.route("/alertas", methods=["GET"])
@requiere_autenticacion
def obtener_alertas_usuario(usuario_id):
    db: Session = next(get_db())
    hoy = datetime.now().date()
    tres_dias = hoy + timedelta(days=3)
    siete_dias = hoy + timedelta(days=7)
    
    try:
        prestamos = db.query(models.Prestamo).join(models.Ejemplar).join(models.Libro).filter(
            models.Prestamo.id_usuario == usuario_id,
            models.Prestamo.estado == 'activo',
            models.Prestamo.fecha_vencimiento <= siete_dias
        ).all()
        
        alertas = []
        for p in prestamos:
            dias_restantes = (p.fecha_vencimiento - hoy).days
            
            alerta = {
                "id_prestamo": p.id_prestamo,
                "titulo": p.ejemplar.libro.titulo,
                "fecha_vencimiento": p.fecha_vencimiento.strftime("%d/%m/%Y")
            }
            
            if dias_restantes <= 3:
                alerta["mensaje"] = f"Préstamo vence en {dias_restantes} días"
                alerta["prioridad"] = "alta"
            else:
                alerta["mensaje"] = f"Préstamo vence en {dias_restantes} días"
                alerta["prioridad"] = "media"
            
            alertas.append(alerta)
        
        return jsonify(alertas)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

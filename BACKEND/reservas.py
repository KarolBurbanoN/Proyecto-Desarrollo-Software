from flask import Blueprint, request, jsonify
from datetime import datetime
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS import models
from sqlalchemy.orm import Session
from functools import wraps
from flask import session

reservas_bp = Blueprint("reservas", __name__, url_prefix="/api/reservas")

def requiere_autenticacion(f):
    @wraps(f)
    def decorador(*args, **kwargs):

        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({"error": "No autorizado"}), 401
        
        return f(usuario_id, *args, **kwargs)
    return decorador

@reservas_bp.route("/", methods=["POST"])
@requiere_autenticacion
def crear_reserva(usuario_id):
    db: Session = next(get_db())
    data = request.get_json()
    
    # Validar datos
    if 'ISBN' not in data:
        return jsonify({"error": "Falta el ISBN del libro"}), 400
    
    try:
        # Verificar si el libro existe
        libro = db.query(models.Libro).filter_by(ISBN=data['ISBN']).first()
        if not libro:
            return jsonify({"error": "Libro no encontrado"}), 404
        
        # Verificar si el usuario ya tiene este libro prestado
        prestamo_activo = db.query(models.Prestamo).join(models.Ejemplar).filter(
            models.Prestamo.id_usuario == usuario_id,
            models.Ejemplar.ISBN == data['ISBN'],
            models.Prestamo.estado == 'activo'
        ).first()
        
        if prestamo_activo:
            return jsonify({"error": "Ya tienes este libro prestado"}), 400
        
        # Verificar si el usuario ya tiene una reserva activa para este libro
        reserva_activa = db.query(models.Reserva).filter(
            models.Reserva.id_usuario == usuario_id,
            models.Reserva.ISBN == data['ISBN'],
            models.Reserva.estado.in_(['pendiente', 'notificado'])
        ).first()
        
        if reserva_activa:
            return jsonify({"error": "Ya tienes una reserva activa para este libro"}), 400
        
        # Verificar si hay ejemplares disponibles
        ejemplares_disponibles = db.query(models.Ejemplar).filter_by(
            ISBN=data['ISBN'],
            estado='disponible'
        ).count()
        
        if ejemplares_disponibles > 0:
            return jsonify({"error": "El libro está disponible para préstamo"}), 400
        
        # Crear reserva
        nueva_reserva = models.Reserva(
            id_usuario=usuario_id,
            ISBN=data['ISBN'],
            fecha_reserva=datetime.now().date(),
            estado='pendiente'
        )
        
        db.add(nueva_reserva)
        db.commit()
        
        return jsonify({
            "mensaje": "Reserva realizada correctamente",
            "posicion": db.query(models.Reserva).filter(
                models.Reserva.ISBN == data['ISBN'],
                models.Reserva.estado == 'pendiente'
            ).count()  # Posición en la cola de reservas
        }), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

@reservas_bp.route("/usuario", methods=["GET"])
@requiere_autenticacion
def obtener_reservas_usuario(usuario_id):
    db: Session = next(get_db())
    
    try:
        reservas = db.query(models.Reserva).join(models.Libro).filter(
            models.Reserva.id_usuario == usuario_id,
            models.Reserva.estado.in_(['pendiente', 'notificado'])  # Solo mostrar estas
        ).all()
        
        return jsonify([{
            "id_reserva": r.id_reserva,
            "fecha_reserva": r.fecha_reserva.strftime("%Y-%m-%d"),
            "estado": r.estado,
            "libro": {
                "ISBN": r.libro.ISBN,
                "titulo": r.libro.titulo,
                "autores": [{"nombre": a.nombre} for a in r.libro.autores],
                "portada": r.libro.portada
            },
            "posicion": db.query(models.Reserva).filter(
                models.Reserva.ISBN == r.ISBN,
                models.Reserva.estado.in_(['pendiente', 'notificado']),
                models.Reserva.fecha_reserva <= r.fecha_reserva
            ).count()
        } for r in reservas])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reservas_bp.route("/<int:id_reserva>", methods=["DELETE"])
@requiere_autenticacion
def cancelar_reserva(usuario_id, id_reserva):
    db: Session = next(get_db())
    
    try:
        reserva = db.query(models.Reserva).filter(
            models.Reserva.id_reserva == id_reserva,
            models.Reserva.id_usuario == usuario_id,
            models.Reserva.estado == 'pendiente'
        ).first()
        
        if not reserva:
            return jsonify({"error": "Reserva no encontrada"}), 404
            
        reserva.estado = 'cancelada'
        db.commit()
        
        return jsonify({"mensaje": "Reserva cancelada correctamente"})
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    
@reservas_bp.route("/<int:id_reserva>/completar", methods=["POST"])
@requiere_autenticacion
def completar_reserva(usuario_id, id_reserva):
    db: Session = next(get_db())
    
    try:
        # Verificar que la reserva existe y pertenece al usuario
        reserva = db.query(models.Reserva).filter(
            models.Reserva.id_reserva == id_reserva,
            models.Reserva.id_usuario == usuario_id,
            models.Reserva.estado == 'notificado'
        ).first()
        
        if not reserva:
            return jsonify({"error": "Reserva no encontrada o no está en estado notificado"}), 404
            
        # Marcar la reserva como completada
        reserva.estado = 'completada'
        db.commit()
        
        return jsonify({"mensaje": "Reserva marcada como completada"})
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
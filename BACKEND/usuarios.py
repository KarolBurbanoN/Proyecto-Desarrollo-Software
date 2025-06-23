from flask import Blueprint, request, jsonify, session, Response
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS.models import Usuario
from sqlalchemy.orm import Session
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
from datetime import datetime, timedelta

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

# --- Almacenamiento temporal para recuperación ---
recovery_data = {}

# --- Función simple para enviar correos ---
def enviar_correo(destinatario, asunto, mensaje):
    remitente = "alexandriabiblioteca611@gmail.com"
    contraseña = "hfdswqpkfvbkfudm"

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
        return True
    except Exception as e:
        print("Error al enviar correo:", e)
        return False


# --- Función para limpiar códigos expirados ---
def limpiar_codigos_expirados():
    ahora = datetime.now()
    for email, data in list(recovery_data.items()):
        if 'expira' in data and data['expira'] < ahora:
            del recovery_data[email]

@usuarios_bp.route("/", methods=["POST"])
def registrar_usuario():
    db: Session = next(get_db())
    data = request.json

    campos_requeridos = ["tipo_documento", "numero_documento", "nombres", "apellidos", 
                         "fecha_nacimiento", "genero", "correo", "contraseña", "rol"]
    for campo in campos_requeridos:
        if campo not in data or not data[campo]:
            return jsonify({"error": f"Campo requerido faltante: {campo}"}), 400

    if db.query(Usuario).filter_by(numero_documento=data["numero_documento"]).first():
        return jsonify({"error": "Documento ya registrado"}), 400
    if db.query(Usuario).filter_by(correo=data["correo"]).first():
        return jsonify({"error": "Correo electrónico ya registrado"}), 400

    data["contraseña"] = bcrypt.hashpw(data["contraseña"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    estado_recibido = data.pop('estado', 'activo').lower()
    
    if estado_recibido in ['activo', 'activa']:
        data['estado_cuenta'] = 'activa'
    elif estado_recibido == 'bloqueada':
        data['estado_cuenta'] = 'bloqueada'
    else:
        return jsonify({"error": "Estado no válido"}), 400

    nuevo_usuario = Usuario(**data)
    db.add(nuevo_usuario)
    db.commit()

    return jsonify({
        "mensaje": "Usuario registrado correctamente",
        "usuario": {
            "tipo_documento": nuevo_usuario.tipo_documento,
            "numero_documento": nuevo_usuario.numero_documento,
            "nombres": nuevo_usuario.nombres,
            "apellidos": nuevo_usuario.apellidos,
            "correo": nuevo_usuario.correo,
            "rol": nuevo_usuario.rol,
            "estado_cuenta": nuevo_usuario.estado_cuenta
        }
    }), 201

@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    db: Session = next(get_db())
    
    # Verificar si el usuario actual es bibliotecario
    if 'usuario' in session:
        usuario_actual = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()
        if usuario_actual and usuario_actual.rol == 'bibliotecario':
            usuarios = db.query(Usuario).filter_by(rol='lector').all()
        else:
            usuarios = db.query(Usuario).all()
    else:
        usuarios = db.query(Usuario).filter_by(rol='lector').all()

    resultado = []
    for u in usuarios:
        resultado.append({
            "tipo_documento": u.tipo_documento,
            "numero_documento": u.numero_documento,
            "nombres": u.nombres,
            "apellidos": u.apellidos,
            "fecha_nacimiento": u.fecha_nacimiento.isoformat() if u.fecha_nacimiento else None,
            "genero": u.genero,
            "direccion": u.direccion,
            "ciudad": u.ciudad,
            "telefono": u.telefono,
            "correo": u.correo,
            "rol": u.rol,
            "estado": u.estado_cuenta 
        })
    return jsonify(resultado)

@usuarios_bp.route("/<string:numero_documento>", methods=["PUT"])
def actualizar_usuario(numero_documento):
    db: Session = next(get_db())
    data = request.json

    usuario = db.query(Usuario).filter_by(numero_documento=numero_documento).first()
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    campos_permitidos = ["nombres", "apellidos", "fecha_nacimiento", "genero", 
                         "direccion", "ciudad", "telefono", "correo", "rol", "estado"]

    for campo in campos_permitidos:
        if campo in data:
            setattr(usuario, campo, data[campo])

    if "contraseña" in data and data["contraseña"]:
        usuario.contraseña = bcrypt.hashpw(data["contraseña"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    db.commit()
    return jsonify({"mensaje": "Usuario actualizado"})

@usuarios_bp.route("/<string:numero_documento>", methods=["DELETE"])
def eliminar_usuario(numero_documento):
    db: Session = next(get_db())
    usuario = db.query(Usuario).filter_by(numero_documento=numero_documento).first()
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.delete(usuario)
    db.commit()
    return jsonify({"mensaje": "Usuario eliminado correctamente"})

@usuarios_bp.route("/perfil", methods=["GET"])
def obtener_perfil_usuario():
    if 'usuario' not in session:
        return jsonify({"error": "No autorizado"}), 401

    db: Session = next(get_db())
    usuario = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({
        "tipo_documento": usuario.tipo_documento,
        "numero_documento": usuario.numero_documento,
        "nombres": usuario.nombres,
        "apellidos": usuario.apellidos,
        "fecha_nacimiento": usuario.fecha_nacimiento.isoformat() if usuario.fecha_nacimiento else None,
        "genero": usuario.genero,
        "direccion": usuario.direccion,
        "ciudad": usuario.ciudad,
        "telefono": usuario.telefono,
        "correo": usuario.correo,
        "rol": usuario.rol
    })

@usuarios_bp.route("/perfil", methods=["PUT"])
def actualizar_perfil_usuario():
    if 'usuario' not in session:
        return jsonify({"error": "No autorizado"}), 401

    db: Session = next(get_db())
    usuario = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.json
    campos_permitidos = ["nombres", "apellidos", "genero", "direccion", "ciudad", "telefono", "correo"]
    for campo in data:
        if campo in campos_permitidos:
            setattr(usuario, campo, data[campo])

    if "contraseña" in data and data["contraseña"]:
        usuario.contraseña = bcrypt.hashpw(data["contraseña"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    db.commit()
    return jsonify({"mensaje": "Perfil actualizado correctamente"})

@usuarios_bp.route("/<string:numero_documento>/estado", methods=["PUT"])
def cambiar_estado_usuario(numero_documento):
    db: Session = next(get_db())
    data = request.json

    # Validar que se envió el estado
    if 'estado' not in data:
        return jsonify({"error": "Campo 'estado' es requerido"}), 400

    # Validar el valor del estado
    estado = data['estado'].lower()
    if estado not in ['activa', 'bloqueada']:
        return jsonify({"error": "Estado debe ser 'activa' o 'bloqueada'"}), 400

    # Buscar el usuario
    usuario = db.query(Usuario).filter_by(numero_documento=numero_documento).first()
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Actualizar el estado_cuenta (manteniendo el nombre original)
    usuario.estado_cuenta = estado
    db.commit()

    return jsonify({
        "mensaje": f"Estado actualizado a {estado}",
        "numero_documento": usuario.numero_documento,
        "estado": usuario.estado_cuenta  # Respuesta con el nombre del campo
    })

# --- Rutas de recuperación de contraseña ---
@usuarios_bp.route("/send-recovery-code", methods=["POST"])
def send_recovery_code():
    db: Session = next(get_db())
    data = request.get_json()
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({"error": "Email requerido"}), 400

    limpiar_codigos_expirados()

    usuario = db.query(Usuario).filter(Usuario.correo.ilike(email)).first()
    if not usuario:
        return jsonify({"success": True, "message": "Si el email existe, se enviará un código"})

    codigo = f"{secrets.randbelow(900000) + 100000:06d}"
    recovery_data[email] = {
        'codigo': codigo,
        'intentos': 0,
        'expira': datetime.now() + timedelta(minutes=15)
    }

    asunto = "Código de recuperación de contraseña"
    mensaje = f"""Hola {usuario.nombres},

Has solicitado restablecer tu contraseña. Usa el siguiente código:

{codigo}

Este código expirará en 15 minutos.

Si no solicitaste este cambio, por favor ignora este mensaje.

Atentamente,
Biblioteca Alexandria
"""

    if enviar_correo(email, asunto, mensaje):
        return jsonify({"success": True, "message": "Código enviado correctamente"})
    return jsonify({"error": "Error al enviar el código. Intente nuevamente."}), 500

@usuarios_bp.route("/verify-recovery-code", methods=["POST"])
def verify_recovery_code():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    codigo = data.get('code', '').strip()

    if not email or not codigo:
        return jsonify({"error": "Email y código requeridos"}), 400

    limpiar_codigos_expirados()

    if email not in recovery_data:
        return jsonify({"error": "Código inválido o expirado"}), 400

    datos = recovery_data[email]
    if datos['intentos'] >= 3:
        del recovery_data[email]
        return jsonify({"error": "Demasiados intentos fallidos"}), 400

    if datos['codigo'] != codigo:
        datos['intentos'] += 1
        return jsonify({"error": "Código incorrecto"}), 400

    token = secrets.token_urlsafe(32)
    datos['token_valido'] = token
    datos['intentos'] = 0
    return jsonify({"success": True, "token": token, "message": "Código verificado correctamente"})

@usuarios_bp.route("/update-password", methods=["POST"])
def update_password():
    db: Session = next(get_db())
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    token = data.get('token')
    new_password = data.get('newPassword')

    if not email or not new_password or not token:
        return jsonify({"error": "Datos incompletos"}), 400

    if len(new_password) < 8:
        return jsonify({"error": "La contraseña debe tener al menos 8 caracteres"}), 400

    if email not in recovery_data or recovery_data[email].get('token_valido') != token:
        return jsonify({"error": "Token inválido o expirado"}), 401

    usuario = db.query(Usuario).filter(Usuario.correo.ilike(email)).first()
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    usuario.contraseña = hashed_pw

    try:
        db.commit()
        del recovery_data[email]
        return jsonify({"success": True, "message": "Contraseña actualizada correctamente"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": "Error al actualizar contraseña", "details": str(e)}), 500

@usuarios_bp.route("/enviar-mensaje-contacto", methods=["POST"])
def enviar_mensaje_contacto():
    data = request.form

    campos_requeridos = ["nombre", "correo", "mensaje"]
    for campo in campos_requeridos:
        if campo not in data or not data[campo].strip():
            return jsonify({"error": f"Campo requerido faltante: {campo}"}), 400  # SIEMPRE JSON

    nombre = data["nombre"].strip()
    correo = data["correo"].strip()
    mensaje = data["mensaje"].strip()

    if len(mensaje) < 10:
        return jsonify({"error": "El mensaje es demasiado corto (mínimo 10 caracteres)"}), 400  # JSON también

    asunto = f"Nuevo mensaje de contacto de {nombre}"
    cuerpo = f"""
Has recibido un nuevo mensaje de contacto desde el sitio web:

Nombre: {nombre}
Correo: {correo}
Mensaje:
{mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de la Biblioteca Alexandria.
"""

    exito = enviar_correo("alexandriabiblioteca611@gmail.com", asunto, cuerpo)

    if exito:
        return jsonify({"success": True, "message": "Mensaje enviado correctamente"})  # JSON para JS
    else:
        return jsonify({"error": "Error al enviar el mensaje"}), 500  # JSON para JS

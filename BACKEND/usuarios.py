# BACKEND/usuarios.py

from flask import Blueprint, request, jsonify, session
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS.models import Usuario
from sqlalchemy.orm import Session
import bcrypt

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")

@usuarios_bp.route("/", methods=["POST"])
def registrar_usuario():
    db: Session = next(get_db())
    data = request.json

    # Validar campos requeridos
    campos_requeridos = ["tipo_documento", "numero_documento", "nombres", "apellidos", 
                        "fecha_nacimiento", "genero", "correo", "contraseña", "rol"]
    for campo in campos_requeridos:
        if campo not in data or not data[campo]:
            return jsonify({"error": f"Campo requerido faltante: {campo}"}), 400

    # Validar documento único
    if db.query(Usuario).filter_by(numero_documento=data["numero_documento"]).first():
        return jsonify({"error": "Documento ya registrado"}), 400

    # Validar correo único
    if db.query(Usuario).filter_by(correo=data["correo"]).first():
        return jsonify({"error": "Correo electrónico ya registrado"}), 400

    # Cifrar contraseña
    data["contraseña"] = bcrypt.hashpw(data["contraseña"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    #manjeo de estado
    estado_recibido = data.pop('estado', 'activo').lower()
    
    #conversion de valores validos.

    if estado_recibido in ['activo', 'activa']:
        data['estado_cuenta'] = 'activa'
    elif estado_recibido == 'bloqueada':
        data['estado_cuenta']='bloqueada'
    else:
        return jsonify ({
            "error": "estado no valido",
            "detalle": "debe ser 'activa'/'activo' o 'bloqueada"
            }),400
    
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
    usuarios = db.query(Usuario).all()
    
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

    # Actualizar campos permitidos
    campos_permitidos = ["nombres", "apellidos", "fecha_nacimiento", "genero", 
                        "direccion", "ciudad", "telefono", "correo", "rol", "estado"]
    
    for campo in campos_permitidos:
        if campo in data:
            setattr(usuario, campo, data[campo])

    # Actualizar contraseña si se proporciona
    if "contraseña" in data and data["contraseña"]:
        usuario.contraseña = bcrypt.hashpw(data["contraseña"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    db.commit()
    
    return jsonify({
        "mensaje": "Usuario actualizado",
        "usuario": {
            "numero_documento": usuario.numero_documento,
            "nombres": usuario.nombres,
            "apellidos": usuario.apellidos,
            "correo": usuario.correo,
            "rol": usuario.rol,
            "estado": usuario.estado_cuenta
        }
    })

@usuarios_bp.route("/<string:numero_documento>", methods=["DELETE"])
def eliminar_usuario(numero_documento):
    db: Session = next(get_db())
    
    usuario = db.query(Usuario).filter_by(numero_documento=numero_documento).first()
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.delete(usuario)
    db.commit()
    
    return jsonify({"mensaje": "Usuario eliminado correctamente"})

# BACKEND/routes/usuarios.py - Añadir estas rutas al final

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
    usuario = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()  # Corregido: session en lugar de Session
    
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    data = request.json
    
    # Campos permitidos para actualización
    campos_permitidos = ["nombres", "apellidos", "genero", "direccion", "ciudad", "telefono", "correo"]
    
    for campo in campos_permitidos:
        if campo in data:
            setattr(usuario, campo, data[campo])
    
    # Actualizar contraseña si se proporciona
    if "contraseña" in data and data["contraseña"]:
        usuario.contraseña = bcrypt.hashpw(data["contraseña"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    db.commit()
    
    return jsonify({
        "mensaje": "Perfil actualizado correctamente",
        "usuario": {
            "nombres": usuario.nombres,
            "apellidos": usuario.apellidos,
            "correo": usuario.correo,
            "genero": usuario.genero,
            "direccion": usuario.direccion,
            "ciudad": usuario.ciudad,
            "telefono": usuario.telefono
        }
    })

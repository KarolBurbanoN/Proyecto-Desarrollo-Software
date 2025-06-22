from flask import Blueprint, jsonify, session
from datetime import datetime
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS import models
from sqlalchemy.orm import Session
from functools import wraps

sanciones_bp = Blueprint("sanciones", __name__, url_prefix="/api/sanciones")

# Decorador para autenticación basado en la sesión
def requiere_autenticacion(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({"error": "No autorizado"}), 401
        return f(usuario_id, *args, **kwargs)
    return decorador

# Ruta para obtener las sanciones activas del usuario
@sanciones_bp.route("/usuario", methods=["GET"])
@requiere_autenticacion
def obtener_sanciones_usuario(usuario_id):
    db: Session = next(get_db())
    try:
        hoy = datetime.now().date()

        sanciones = db.query(models.Sancion).filter(
            models.Sancion.id_usuario == usuario_id,
            models.Sancion.fecha_fin >= hoy
        ).all()

        resultado = []
        for s in sanciones:
            # Buscar el préstamo más cercano a la fecha de la sanción
            prestamo_relacionado = db.query(models.Prestamo).join(models.Ejemplar).join(models.Libro).filter(
                models.Prestamo.id_usuario == usuario_id,
                models.Prestamo.fecha_vencimiento <= s.fecha_inicio
            ).order_by(models.Prestamo.fecha_vencimiento.desc()).first()

            titulo = prestamo_relacionado.ejemplar.libro.titulo if prestamo_relacionado else "Libro no identificado"

            resultado.append({
                "motivo": s.motivo,
                "fecha_inicio": s.fecha_inicio.strftime("%Y-%m-%d"),
                "fecha_fin": s.fecha_fin.strftime("%Y-%m-%d"),
                "titulo_libro": titulo
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

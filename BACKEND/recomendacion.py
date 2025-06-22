from flask import Blueprint, jsonify, session
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS import models
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import desc

recomendacion_bp = Blueprint("recomendacion", __name__, url_prefix="/api")

# ✅ Decorador para verificar autenticación directamente aquí
def requiere_autenticacion(f):
    from functools import wraps
    @wraps(f)
    def decorador(*args, **kwargs):
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({"error": "No autorizado"}), 401
        return f(usuario_id, *args, **kwargs)
    return decorador

@recomendacion_bp.route("/recomendacion", methods=["GET"])
@requiere_autenticacion
def recomendacion_lector(usuario_id):
    db: Session = next(get_db())

    try:
        # 1. Obtener los ISBN de libros que el usuario ya ha prestado
        libros_leidos = db.query(models.Libro.ISBN)\
            .join(models.Ejemplar, models.Libro.ISBN == models.Ejemplar.ISBN)\
            .join(models.Prestamo, models.Ejemplar.id_ejemplar == models.Prestamo.id_ejemplar)\
            .filter(models.Prestamo.id_usuario == usuario_id)\
            .distinct().all()

        isbn_excluidos = [isbn[0] for isbn in libros_leidos]

        # 2. Obtener el género favorito del usuario
        genero_favorito = None
        if isbn_excluidos:
            genero_favorito_row = db.query(
                models.Libro.genero,
                func.count().label('frecuencia')
            ).filter(models.Libro.ISBN.in_(isbn_excluidos))\
             .group_by(models.Libro.genero)\
             .order_by(desc('frecuencia'))\
             .first()
            if genero_favorito_row:
                genero_favorito = genero_favorito_row[0]

        # 3. Buscar libro no leído que coincida con el género favorito
        query = db.query(models.Libro).filter(~models.Libro.ISBN.in_(isbn_excluidos))
        if genero_favorito:
            query = query.filter(models.Libro.genero == genero_favorito)

        libro = query.order_by(func.random()).first()

        # 4. Si no hay, intentar con cualquier libro no leído
        if not libro and isbn_excluidos:
            libro = db.query(models.Libro).filter(~models.Libro.ISBN.in_(isbn_excluidos))\
                    .order_by(func.random()).first()

        # 5. Si ya leyó todo, recomendar uno cualquiera
        if not libro:
            libro = db.query(models.Libro).order_by(func.random()).first()

        # 6. Si aún no hay, error
        if not libro:
            return jsonify({"error": "No hay libros disponibles para recomendar"}), 404

        return jsonify({
            "ISBN": libro.ISBN,
            "titulo": libro.titulo,
            "genero": libro.genero,
            "portada": libro.portada or "/static/default-book.png"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

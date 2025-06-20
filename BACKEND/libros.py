# BACKEND/libros.py
from flask import Blueprint, request, jsonify
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS.models import Libro, Autor
from datetime import datetime, timedelta
from BASE_DE_DATOS import models
from sqlalchemy.orm import Session

libros_bp = Blueprint("libros", __name__, url_prefix="/api/libros")

@libros_bp.route("/", methods=["POST"])
def registrar_libro():
    db: Session = next(get_db())
    data = request.get_json()

    try:
        # Validar campos requeridos
        campos_requeridos = ["titulo", "autores", "portada", "genero", "editorial", "ISBN"]
        for campo in campos_requeridos:
            if campo not in data or not data[campo]:
                return jsonify({"error": f"Falta el campo: {campo}"}), 400

        # Verificar si el ISBN ya existe
        if db.query(Libro).filter_by(ISBN=data["ISBN"]).first():
            return jsonify({"error": "ISBN ya registrado"}), 400

        # Crear nuevo libro
        nuevo_libro = Libro(
            ISBN=data["ISBN"],
            titulo=data["titulo"],
            portada=data["portada"],
            genero=data["genero"],
            editorial=data["editorial"],
            año_publicacion=data.get("year", None),
            promedio_calificacion=0.0,
            descripcion_libro=data.get("descripcion_libro", "") 
        )

        db.add(nuevo_libro)
        db.commit()

        # Manejar autores (simplificado)
        for autor_nombre in data["autores"]:
            autor = db.query(Autor).filter_by(nombre=autor_nombre).first()
            if not autor:
                autor = Autor(nombre=autor_nombre)
                db.add(autor)
            nuevo_libro.autores.append(autor)

        db.commit()

        return jsonify({
            "mensaje": "Libro registrado correctamente",
            "libro": {
                "ISBN": nuevo_libro.ISBN,
                "titulo": nuevo_libro.titulo,
                "portada": nuevo_libro.portada
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

@libros_bp.route("/", methods=["GET"])
def obtener_libros():
    db: Session = next(get_db())
    libros = db.query(models.Libro).all()
    
    return jsonify([{
        'ISBN': libro.ISBN,
        'titulo': libro.titulo,
        'autores': [{'nombre': autor.nombre} for autor in libro.autores],
        'portada': libro.portada,
        'promedio_calificacion': float(libro.promedio_calificacion) if libro.promedio_calificacion else 0.0,
        'editorial': libro.editorial,
        'genero': libro.genero,
        'descripcion_libro': libro.descripcion_libro
    } for libro in libros])
    
@libros_bp.route("/<isbn>", methods=["PUT"])
def actualizar_libro(isbn):
    db: Session = next(get_db())
    libro = db.query(models.Libro).filter_by(ISBN=isbn).first()
    
    if not libro:
        return jsonify({"error": "Libro no encontrado"}), 404
    
    data = request.get_json()
    
    # Actualizar campos permitidos
    if 'titulo' in data: libro.titulo = data['titulo']
    if 'editorial' in data: libro.editorial = data['editorial']
    if 'year' in data: libro.año_publicacion = data['year']
    if 'genero' in data: libro.genero = data['genero']
    if 'portada' in data: libro.portada = data['portada']
    
    # Manejar autores (simplificado)
    if 'autores' in data:
        libro.autores = []
        for autor_nombre in data['autores']:
            autor = db.query(models.Autor).filter_by(nombre=autor_nombre).first()
            if not autor:
                autor = models.Autor(nombre=autor_nombre)
                db.add(autor)
            libro.autores.append(autor)
    
    db.commit()
    return jsonify({"mensaje": "Libro actualizado correctamente"})

@libros_bp.route("/<isbn>", methods=["DELETE"])
def eliminar_libro(isbn):
    db: Session = next(get_db())
    libro = db.query(models.Libro).filter_by(ISBN=isbn).first()
    
    if not libro:
        return jsonify({"error": "Libro no encontrado"}), 404
    
    db.delete(libro)
    db.commit()
    return jsonify({"mensaje": "Libro eliminado correctamente"})

@libros_bp.route("/<isbn>", methods=["GET"])
def obtener_libro(isbn):
    db: Session = next(get_db())
    libro = db.query(models.Libro).filter_by(ISBN=isbn).first()
    
    if not libro:
        return jsonify({"error": "Libro no encontrado"}), 404
    
    return jsonify({
        'ISBN': libro.ISBN,
        'titulo': libro.titulo,
        'autores': [{'nombre': autor.nombre} for autor in libro.autores],
        'portada': libro.portada,
        'promedio_calificacion': float(libro.promedio_calificacion) if libro.promedio_calificacion else 0.0,
        'editorial': libro.editorial,
        'genero': libro.genero,
        'descripcion_libro': libro.descripcion_libro
    })

# En libros.py
@libros_bp.route("/<isbn>/disponibilidad", methods=["GET"])
def verificar_disponibilidad(isbn):
    db: Session = next(get_db())
    
    # 1. Verificar si hay ejemplares disponibles
    ejemplares_disponibles = db.query(models.Ejemplar).filter_by(
        ISBN=isbn,
        estado='disponible'
    ).count()
    
    # 2. Verificar si el usuario ya tiene prestado este libro
    # (implementar según tu lógica)
    
    return jsonify({
        "disponible": ejemplares_disponibles > 0
    })

# Crear un nuevo archivo prestamos.py
prestamos_bp = Blueprint("prestamos", __name__, url_prefix="/api/prestamos")

@prestamos_bp.route("/", methods=["POST"])
def crear_prestamo():
    db: Session = next(get_db())
    data = request.get_json()
    
    # Validar datos
    if 'ISBN' not in data or 'usuario_id' not in data:
        return jsonify({"error": "Faltan datos requeridos"}), 400
    
    # Buscar un ejemplar disponible
    ejemplar = db.query(models.Ejemplar).filter_by(
        ISBN=data['ISBN'],
        estado='disponible'
    ).first()
    
    if not ejemplar:
        return jsonify({"error": "No hay ejemplares disponibles"}), 400
    
    # Crear préstamo
    nuevo_prestamo = models.Prestamo(
        id_usuario=data['usuario_id'],
        id_ejemplar=ejemplar.id_ejemplar,
        fecha_prestamo=datetime.now().date(),
        fecha_vencimiento=datetime.now().date() + timedelta(days=15),
        estado='activo'
    )
    
    # Actualizar estado del ejemplar
    ejemplar.estado = 'prestado'
    
    db.add(nuevo_prestamo)
    db.commit()
    
    return jsonify({"mensaje": "Préstamo realizado correctamente"}), 201
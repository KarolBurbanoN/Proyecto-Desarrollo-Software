from flask import Blueprint, jsonify, request
from sqlalchemy import desc, func
from datetime import datetime
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS import models

informes_bp = Blueprint('informes', __name__, url_prefix='/api/informes')

@informes_bp.route("/prestamos-usuario")
def reporte_prestamos_usuario():
    db = next(get_db())
    try:
        hoy = datetime.now().date()
        # Préstamos activos (no devueltos y no vencidos)
        activos = db.query(models.Prestamo).filter(
            models.Prestamo.estado == 'activo',
            models.Prestamo.fecha_vencimiento >= hoy
        ).count()
        # Préstamos vencidos (estado activo pero fecha_vencimiento < hoy)
        vencidos = db.query(models.Prestamo).filter(
            models.Prestamo.estado == 'activo',
            models.Prestamo.fecha_vencimiento < hoy
        ).count()
        # Total de devoluciones registradas
        devueltos = db.query(models.Devolucion).count()

        return jsonify({
            'prestamos_activos': activos,
            'prestamos_vencidos': vencidos,
            'devoluciones': devueltos
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@informes_bp.route("/prestamos-activos")
def prestamos_activos():
    db = next(get_db())
    try:
        hoy = datetime.now().date()
        prestamos = db.query(models.Prestamo).join(models.Ejemplar).join(models.Libro).join(models.Usuario).filter(
            models.Prestamo.estado == 'activo',
            models.Prestamo.fecha_vencimiento >= hoy
        ).all()

        resultado = []
        for p in prestamos:
            nombre_usuario = p.usuario.nombres if hasattr(p.usuario, 'nombres') else ''
            apellido_usuario = p.usuario.apellidos if hasattr(p.usuario, 'apellidos') else ''
            titulo_libro = p.ejemplar.libro.titulo if p.ejemplar and p.ejemplar.libro else ''
            isbn_libro = p.ejemplar.libro.ISBN if p.ejemplar and p.ejemplar.libro else ''
            portada_libro = p.ejemplar.libro.portada if p.ejemplar and p.ejemplar.libro and hasattr(p.ejemplar.libro, 'portada') else None

            resultado.append({
                'id_prestamo': p.id_prestamo,
                'fecha_prestamo': p.fecha_prestamo.strftime('%Y-%m-%d'),
                'fecha_vencimiento': p.fecha_vencimiento.strftime('%Y-%m-%d'),
                'libro': {
                    'titulo': titulo_libro,
                    'ISBN': isbn_libro,
                    'portada': portada_libro
                },
                'usuario': {
                    'nombre': nombre_usuario,
                    'apellido': apellido_usuario
                }
            })
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@informes_bp.route("/prestamos-vencidos")
def prestamos_vencidos():
    db = next(get_db())
    try:
        hoy = datetime.now().date()
        prestamos = db.query(models.Prestamo).join(models.Ejemplar).join(models.Libro).join(models.Usuario).filter(
            models.Prestamo.estado == 'activo',
            models.Prestamo.fecha_vencimiento < hoy
        ).all()

        resultado = []
        for p in prestamos:
            nombre_usuario = p.usuario.nombres if hasattr(p.usuario, 'nombres') else ''
            apellido_usuario = p.usuario.apellidos if hasattr(p.usuario, 'apellidos') else ''
            titulo_libro = p.ejemplar.libro.titulo if p.ejemplar and p.ejemplar.libro else ''
            isbn_libro = p.ejemplar.libro.ISBN if p.ejemplar and p.ejemplar.libro else ''
            portada_libro = p.ejemplar.libro.portada if p.ejemplar and p.ejemplar.libro and hasattr(p.ejemplar.libro, 'portada') else None

            resultado.append({
                'id_prestamo': p.id_prestamo,
                'fecha_prestamo': p.fecha_prestamo.strftime('%Y-%m-%d'),
                'fecha_vencimiento': p.fecha_vencimiento.strftime('%Y-%m-%d'),
                'libro': {
                    'titulo': titulo_libro,
                    'ISBN': isbn_libro,
                    'portada': portada_libro
                },
                'usuario': {
                    'nombre': nombre_usuario,
                    'apellido': apellido_usuario
                }
            })
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@informes_bp.route("/devoluciones-recientes")
def devoluciones_recientes():
    db = next(get_db())
    try:
        devoluciones = db.query(models.Devolucion).join(models.Prestamo).join(models.Ejemplar).join(models.Libro).join(models.Usuario).order_by(
            desc(models.Devolucion.fecha_devolucion)
        ).limit(20).all()

        resultado = []
        for d in devoluciones:
            p = d.prestamo
            nombre_usuario = p.usuario.nombres if hasattr(p.usuario, 'nombres') else ''
            apellido_usuario = p.usuario.apellidos if hasattr(p.usuario, 'apellidos') else ''
            titulo_libro = p.ejemplar.libro.titulo if p.ejemplar and p.ejemplar.libro else ''
            isbn_libro = p.ejemplar.libro.ISBN if p.ejemplar and p.ejemplar.libro else ''
            portada_libro = p.ejemplar.libro.portada if p.ejemplar and p.ejemplar.libro and hasattr(p.ejemplar.libro, 'portada') else None

            resultado.append({
                'id_devolucion': d.id_devolucion,
                'fecha_devolucion': d.fecha_devolucion.strftime('%Y-%m-%d'),
                'fecha_prestamo': p.fecha_prestamo.strftime('%Y-%m-%d') if p.fecha_prestamo else None,
                'libro': {
                    'titulo': titulo_libro,
                    'ISBN': isbn_libro,
                    'portada': portada_libro
                },
                'usuario': {
                    'nombre': nombre_usuario,
                    'apellido': apellido_usuario
                }
            })
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@informes_bp.route("/libros-populares")
def libros_populares():
    db = next(get_db())
    try:
        limite = request.args.get('limite', default=5, type=int)
        
        # Consulta explícita con joins adecuados
        libros = db.query(
            models.Libro.ISBN,
            models.Libro.titulo,
            func.count(models.Prestamo.id_prestamo).label('total_prestamos')
        ).select_from(models.Libro) \
         .join(models.Ejemplar, models.Libro.ISBN == models.Ejemplar.ISBN) \
         .join(models.Prestamo, models.Ejemplar.id_ejemplar == models.Prestamo.id_ejemplar) \
         .group_by(models.Libro.ISBN) \
         .order_by(desc('total_prestamos')) \
         .limit(limite) \
         .all()

        return jsonify([{
            'ISBN': libro.ISBN,
            'titulo': libro.titulo,
            'total_prestamos': libro.total_prestamos
        } for libro in libros])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@informes_bp.route("/libros-mejor-valorados")
def libros_mejor_valorados():
    db = next(get_db())
    try:
        limite = request.args.get('limite', default=5, type=int)
        
        libros = db.query(
            models.Libro.ISBN,
            models.Libro.titulo,
            func.avg(models.Calificacion.estrellas).label('promedio_calificacion'),
            func.count(models.Calificacion.id_calificacion).label('total_resenas')
        ).join(models.Calificacion) \
         .group_by(models.Libro.ISBN) \
         .having(func.avg(models.Calificacion.estrellas) > 0) \
         .order_by(desc('promedio_calificacion')) \
         .limit(limite) \
         .all()

        return jsonify([{
            'ISBN': libro.ISBN,
            'titulo': libro.titulo,
            'promedio_calificacion': float(libro.promedio_calificacion) if libro.promedio_calificacion else 0,
            'total_resenas': libro.total_resenas
        } for libro in libros])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@informes_bp.route("/generos-populares")
def generos_populares():
    db = next(get_db())
    try:
        # Consulta con joins explícitos
        generos = db.query(
            models.Libro.genero,
            func.count(models.Prestamo.id_prestamo).label('total_prestamos')
        ).select_from(models.Libro) \
         .join(models.Ejemplar, models.Libro.ISBN == models.Ejemplar.ISBN) \
         .join(models.Prestamo, models.Ejemplar.id_ejemplar == models.Prestamo.id_ejemplar) \
         .group_by(models.Libro.genero) \
         .order_by(desc('total_prestamos')) \
         .all()

        return jsonify([{
            'genero': genero[0],
            'total_prestamos': genero[1]
        } for genero in generos])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
from sqlalchemy.orm import Session
from .models import Usuario, Libro, Autor, Etiqueta, Ejemplar, Prestamo, Reserva, Devolucion, Sancion, Calificacion, Categoria
from .schemas import (UsuarioCreate, LibroCreate, 
                    AutorCreate, EtiquetaCreate, 
                    EjemplarCreate, PrestamoCreate, 
                    ReservaCreate,  DevolucionCreate, 
                    SancionCreate, CalificacionCreate, 
                    CategoriaCreate)

# Servicio para Usuario
def create_usuario(db: Session, usuario: UsuarioCreate):
    db_usuario = Usuario(**usuario.model_dump())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def get_usuario(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Usuario).offset(skip).limit(limit).all()

def update_usuario(db: Session, usuario_id: int, usuario: UsuarioCreate):
    db_usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if db_usuario:
        update_data = usuario.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_usuario, key, value)
        db.commit()
        db.refresh(db_usuario)
    return db_usuario

def delete_usuario(db: Session, usuario_id: int):
    db_usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if db_usuario:
        db.delete(db_usuario)
        db.commit()
    return db_usuario

# Servicio para Libro
def create_libro(db: Session, libro: LibroCreate):
    db_libro = Libro(**libro.model_dump())
    db.add(db_libro)
    db.commit()
    db.refresh(db_libro)
    return db_libro

def get_libro(db: Session, ISBN: int):
    return db.query(Libro).filter(Libro.ISBN == ISBN).first()

def get_libros(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Libro).offset(skip).limit(limit).all()

def update_libro(db: Session, ISBN: int, libro: LibroCreate):
    db_libro = db.query(Libro).filter(Libro.ISBN == ISBN).first()
    if db_libro:
        update_data = libro.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_libro, key, value)
        db.commit()
        db.refresh(db_libro)
    return db_libro

def delete_libro(db: Session, ISBN: int):
    db_libro = db.query(Libro).filter(Libro.ISBN == ISBN).first()
    if db_libro:
        db.delete(db_libro)
        db.commit()
    return db_libro

# Servicio para Autor
def create_autor(db: Session, autor: AutorCreate):
    db_autor = Autor(**autor.model_dump())
    db.add(db_autor)
    db.commit()
    db.refresh(db_autor)
    return db_autor

def get_autor(db: Session, autor_id: int):
    return db.query(Autor).filter(Autor.id_autor == autor_id).first()

def get_autores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Autor).offset(skip).limit(limit).all()

def update_autor(db: Session, autor_id: int, autor: AutorCreate):
    db_autor = db.query(Autor).filter(Autor.id_autor == autor_id).first()
    if db_autor:
        update_data = autor.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_autor, key, value)
        db.commit()
        db.refresh(db_autor)
    return db_autor

def delete_autor(db: Session, autor_id: int):
    db_autor = db.query(Autor).filter(Autor.id_autor == autor_id).first()
    if db_autor:
        db.delete(db_autor)
        db.commit()
    return db_autor

# Servicio para Etiqueta
def create_etiqueta(db: Session, etiqueta: EtiquetaCreate):
    db_etiqueta = Etiqueta(**etiqueta.model_dump())
    db.add(db_etiqueta)
    db.commit()
    db.refresh(db_etiqueta)
    return db_etiqueta

def get_etiqueta(db: Session, etiqueta_id: int):
    return db.query(Etiqueta).filter(Etiqueta.id_etiqueta == etiqueta_id).first()

def get_etiquetas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Etiqueta).offset(skip).limit(limit).all()

def update_etiqueta(db: Session, etiqueta_id: int, etiqueta: EtiquetaCreate):
    db_etiqueta = db.query(Etiqueta).filter(Etiqueta.id_etiqueta == etiqueta_id).first()
    if db_etiqueta:
        update_data = etiqueta.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_etiqueta, key, value)
        db.commit()
        db.refresh(db_etiqueta)
    return db_etiqueta

def delete_etiqueta(db: Session, etiqueta_id: int):
    db_etiqueta = db.query(Etiqueta).filter(Etiqueta.id_etiqueta == etiqueta_id).first()
    if db_etiqueta:
        db.delete(db_etiqueta)
        db.commit()
    return db_etiqueta

# Servicio para Ejemplar
def create_ejemplar(db: Session, ejemplar: EjemplarCreate):
    db_ejemplar = Ejemplar(**ejemplar.model_dump())
    db.add(db_ejemplar)
    db.commit()
    db.refresh(db_ejemplar)
    return db_ejemplar

def get_ejemplar(db: Session, ejemplar_id: int):
    return db.query(Ejemplar).filter(Ejemplar.id_ejemplar == ejemplar_id).first()

def get_ejemplares(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Ejemplar).offset(skip).limit(limit).all()

def update_ejemplar(db: Session, ejemplar_id: int, ejemplar: EjemplarCreate):
    db_ejemplar = db.query(Ejemplar).filter(Ejemplar.id_ejemplar == ejemplar_id).first()
    if db_ejemplar:
        update_data = ejemplar.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_ejemplar, key, value)
        db.commit()
        db.refresh(db_ejemplar)
    return db_ejemplar

def delete_ejemplar(db: Session, ejemplar_id: int):
    db_ejemplar = db.query(Ejemplar).filter(Ejemplar.id_ejemplar == ejemplar_id).first()
    if db_ejemplar:
        db.delete(db_ejemplar)
        db.commit()
    return db_ejemplar

# Servicio para Prestamo
def create_prestamo(db: Session, prestamo: PrestamoCreate):
    db_prestamo = Prestamo(**prestamo.model_dump())
    db.add(db_prestamo)
    db.commit()
    db.refresh(db_prestamo)
    return db_prestamo

def get_prestamo(db: Session, prestamo_id: int):
    return db.query(Prestamo).filter(Prestamo.id_prestamo == prestamo_id).first()

def get_prestamos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Prestamo).offset(skip).limit(limit).all()

def update_prestamo(db: Session, prestamo_id: int, prestamo: PrestamoCreate):
    db_prestamo = db.query(Prestamo).filter(Prestamo.id_prestamo == prestamo_id).first()
    if db_prestamo:
        update_data = prestamo.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_prestamo, key, value)
        db.commit()
        db.refresh(db_prestamo)
    return db_prestamo

def delete_prestamo(db: Session, prestamo_id: int):
    db_prestamo = db.query(Prestamo).filter(Prestamo.id_prestamo == prestamo_id).first()
    if db_prestamo:
        db.delete(db_prestamo)
        db.commit()
    return db_prestamo

# Servicio para Reserva
def create_reserva(db: Session, reserva: ReservaCreate):
    db_reserva = Reserva(**reserva.model_dump())
    db.add(db_reserva)
    db.commit()
    db.refresh(db_reserva)
    return db_reserva

def get_reserva(db: Session, reserva_id: int):
    return db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()

def get_reservas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Reserva).offset(skip).limit(limit).all()

def update_reserva(db: Session, reserva_id: int, reserva: ReservaCreate):
    db_reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()
    if db_reserva:
        update_data = reserva.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_reserva, key, value)
        db.commit()
        db.refresh(db_reserva)
    return db_reserva

def delete_reserva(db: Session, reserva_id: int):
    db_reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()
    if db_reserva:
        db.delete(db_reserva)
        db.commit()
    return db_reserva

# Servicio para Devolucion
def create_devolucion(db: Session, devolucion: DevolucionCreate):
    db_devolucion = Devolucion(**devolucion.model_dump())
    db.add(db_devolucion)
    db.commit()
    db.refresh(db_devolucion)
    return db_devolucion

def get_devolucion(db: Session, devolucion_id: int):
    return db.query(Devolucion).filter(Devolucion.id_devolucion == devolucion_id).first()

def get_devoluciones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Devolucion).offset(skip).limit(limit).all()

def update_devolucion(db: Session, devolucion_id: int, devolucion: DevolucionCreate):
    db_devolucion = db.query(Devolucion).filter(Devolucion.id_devolucion == devolucion_id).first()
    if db_devolucion:
        update_data = devolucion.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_devolucion, key, value)
        db.commit()
        db.refresh(db_devolucion)
    return db_devolucion

def delete_devolucion(db: Session, devolucion_id: int):
    db_devolucion = db.query(Devolucion).filter(Devolucion.id_devolucion == devolucion_id).first()
    if db_devolucion:
        db.delete(db_devolucion)
        db.commit()
    return db_devolucion

# Servicio para Sancion
def create_sancion(db: Session, sancion: SancionCreate):
    db_sancion = Sancion(**sancion.model_dump())
    db.add(db_sancion)
    db.commit()
    db.refresh(db_sancion)
    return db_sancion

def get_sancion(db: Session, sancion_id: int):
    return db.query(Sancion).filter(Sancion.id_sancion == sancion_id).first()

def get_sanciones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Sancion).offset(skip).limit(limit).all()

def update_sancion(db: Session, sancion_id: int, sancion: SancionCreate):
    db_sancion = db.query(Sancion).filter(Sancion.id_sancion == sancion_id).first()
    if db_sancion:
        update_data = sancion.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_sancion, key, value)
        db.commit()
        db.refresh(db_sancion)
    return db_sancion

def delete_sancion(db: Session, sancion_id: int):
    db_sancion = db.query(Sancion).filter(Sancion.id_sancion == sancion_id).first()
    if db_sancion:
        db.delete(db_sancion)
        db.commit()
    return db_sancion

# Servicio para Calificacion
def create_calificacion(db: Session, calificacion: CalificacionCreate):
    db_calificacion = Calificacion(**calificacion.model_dump())
    db.add(db_calificacion)
    db.commit()
    db.refresh(db_calificacion)
    return db_calificacion

def get_calificacion(db: Session, calificacion_id: int):
    return db.query(Calificacion).filter(Calificacion.id_calificacion == calificacion_id).first()

def get_calificaciones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Calificacion).offset(skip).limit(limit).all()

def update_calificacion(db: Session, calificacion_id: int, calificacion: CalificacionCreate):
    db_calificacion = db.query(Calificacion).filter(Calificacion.id_calificacion == calificacion_id).first()
    if db_calificacion:
        update_data = calificacion.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_calificacion, key, value)
        db.commit()
        db.refresh(db_calificacion)
    return db_calificacion

def delete_calificacion(db: Session, calificacion_id: int):
    db_calificacion = db.query(Calificacion).filter(Calificacion.id_calificacion == calificacion_id).first()
    if db_calificacion:
        db.delete(db_calificacion)
        db.commit()
    return db_calificacion

# Servicio para Categoria
def create_categoria(db: Session, categoria: CategoriaCreate):
    db_categoria = Categoria(**categoria.model_dump())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def get_categoria(db: Session, categoria_id: int):
    return db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()

def get_categorias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Categoria).offset(skip).limit(limit).all()

def update_categoria(db: Session, categoria_id: int, categoria: CategoriaCreate):
    db_categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    if db_categoria:
        update_data = categoria.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_categoria, key, value)
        db.commit()
        db.refresh(db_categoria)
    return db_categoria

def delete_categoria(db: Session, categoria_id: int):
    db_categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    if db_categoria:
        db.delete(db_categoria)
        db.commit()
    return db_categoria
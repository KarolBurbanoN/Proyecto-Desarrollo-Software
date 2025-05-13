from BASE_DE_DATOS.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, CheckConstraint, Text, Numeric, Date, Boolean, TIMESTAMP, text
from sqlalchemy.orm import relationship

# Relaciones N:N (Libro - Autor)
libro_autor = Table(
    'libro_autor',
    Base.metadata,
    Column('ISBN', Integer, ForeignKey('libro.ISBN', ondelete="CASCADE"), primary_key=True),
    Column('id_autor', Integer, ForeignKey('autor.id_autor', ondelete="CASCADE"), primary_key=True)
)

# Relaciones N:N (Libro - Etiqueta)
libro_etiqueta = Table(
    'libro_etiqueta',
    Base.metadata,
    Column('ISBN', Integer, ForeignKey('libro.ISBN', ondelete="CASCADE"), primary_key=True),
    Column('id_etiqueta', Integer, ForeignKey('etiqueta.id_etiqueta', ondelete="CASCADE"), primary_key=True)
)

# 1. Categoría
class Categoria(Base):
    __tablename__ = 'categoria'
    id_categoria = Column(Integer, primary_key=True)
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(String(150))

# 2. Etiqueta
class Etiqueta(Base):
    __tablename__ = 'etiqueta'
    id_etiqueta = Column(Integer, primary_key=True)
    nombre = Column(String(100), unique=True, nullable=False)

# 3. Autor
class Autor(Base):
    __tablename__ = 'autor'
    id_autor = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    biografia = Column(String(150))
    nacionalidad = Column(String(50))

# 4. Usuario
class Usuario(Base):
    __tablename__ = 'usuario'
    id_usuario = Column(Integer, primary_key=True)
    tipo_documento = Column(String(20), nullable=False)
    numero_documento = Column(String(20), nullable=False, unique=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(String(20))
    direccion = Column(Text)
    ciudad = Column(String(50))
    telefono = Column(String(20))
    correo = Column(String(100), nullable=False, unique=True)
    contraseña = Column(Text, nullable=False)
    rol = Column(String(20), nullable=False)
    estado_cuenta = Column(String(20), default='activa')

    __table_args__ = (
        CheckConstraint(rol.in_(['administrador', 'bibliotecario', 'lector'])),
        CheckConstraint(estado_cuenta.in_(['activa', 'bloqueada'])),
    )

# 5. Libro
class Libro(Base):
    __tablename__ = 'libro'
    ISBN = Column(Integer, primary_key=True)
    titulo = Column(String(200), nullable=False)
    editorial = Column(String(100))
    año_publicacion = Column(Integer)
    descripcion_libro = Column(String(200))
    categoria_id = Column(Integer, ForeignKey('categoria.id_categoria'))
    genero = Column(String(50))
    promedio_calificacion = Column(Numeric(3, 2), default=0.0)

    categoria = relationship("Categoria")
    autores = relationship("Autor", secondary=libro_autor, backref="libros")
    etiquetas = relationship("Etiqueta", secondary=libro_etiqueta, backref="libros")

    __table_args__ = (
        CheckConstraint('promedio_calificacion >= 0.0 AND promedio_calificacion <= 5.0'),
    )

# 8. Ejemplar
class Ejemplar(Base):
    __tablename__ = 'ejemplar'
    id_ejemplar = Column(Integer, primary_key=True)
    ISBN = Column(Integer, ForeignKey('libro.ISBN', ondelete='CASCADE'))
    ubicacion = Column(String(100))
    estado = Column(String(20), default='disponible')

    libro = relationship("Libro")

    __table_args__ = (
        CheckConstraint(estado.in_(['disponible', 'prestado', 'dañado', 'perdido'])),
    )

# 9. Préstamo
class Prestamo(Base):
    __tablename__ = 'prestamo'
    id_prestamo = Column(Integer, primary_key=True)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'))
    id_ejemplar = Column(Integer, ForeignKey('ejemplar.id_ejemplar'))
    fecha_prestamo = Column(Date, nullable=False)
    fecha_vencimiento = Column(Date, nullable=False)
    estado = Column(String(20), default='activo')

    usuario = relationship("Usuario")
    ejemplar = relationship("Ejemplar")

    __table_args__ = (
        CheckConstraint(estado.in_(['activo', 'devuelto', 'vencido'])),
    )

# 10. Devolución
class Devolucion(Base):
    __tablename__ = 'devolucion'
    id_devolucion = Column(Integer, primary_key=True)
    id_prestamo = Column(Integer, ForeignKey('prestamo.id_prestamo'))
    fecha_devolucion = Column(Date, nullable=False)
    en_retraso = Column(Boolean, default=False)
    dias_retraso = Column(Integer, default=0)

    prestamo = relationship("Prestamo")

# 11. Sanción
class Sancion(Base):
    __tablename__ = 'sancion'
    id_sancion = Column(Integer, primary_key=True)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'))
    motivo = Column(Text, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)

    usuario = relationship("Usuario")

# 12. Reserva
class Reserva(Base):
    __tablename__ = 'reserva'
    id_reserva = Column(Integer, primary_key=True)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'))
    ISBN = Column(Integer, ForeignKey('libro.ISBN'))
    fecha_reserva = Column(Date, nullable=False)
    estado = Column(String(20), default='pendiente')

    usuario = relationship("Usuario")
    libro = relationship("Libro")

    __table_args__ = (
        CheckConstraint(estado.in_(['pendiente', 'cancelada', 'completada'])),
    )

# 13. Calificación
class Calificacion(Base):
    __tablename__ = 'calificacion'
    id_calificacion = Column(Integer, primary_key=True)
    ISBN = Column(Integer, ForeignKey('libro.ISBN'))
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'))
    estrellas = Column(Integer, nullable=False)
    comentario = Column(Text)

    usuario = relationship("Usuario")
    libro = relationship("Libro")

    __table_args__ = (
        CheckConstraint('estrellas >= 1 AND estrellas <= 5'),
    )

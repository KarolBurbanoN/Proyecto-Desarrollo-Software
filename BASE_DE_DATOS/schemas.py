from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from pydantic import EmailStr


# 1. CATEGORÍA
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(CategoriaBase):
    id_categoria: int

    class Config:
        from_attributes = True

# 2. ETIQUETA
class EtiquetaBase(BaseModel):
    nombre: str

class EtiquetaCreate(EtiquetaBase):
    pass

class Etiqueta(EtiquetaBase):
    id_etiqueta: int

    class Config:
        from_attributes = True

# 3. AUTOR
class AutorBase(BaseModel):
    nombre: str
    biografia: Optional[str] = None
    nacionalidad: Optional[str] = None

class AutorCreate(AutorBase):
    pass

class Autor(AutorBase):
    id_autor: int

    class Config:
        from_attributes = True

# 4. USUARIO
class UsuarioBase(BaseModel):
    tipo_documento: str
    numero_documento: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    genero: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    telefono: Optional[str] = None
    correo: EmailStr
    contraseña: str
    rol: str
    estado_cuenta: Optional[str] = 'activa'

class UsuarioCreate(UsuarioBase):
    pass

class Usuario(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True

# 5. LIBRO
class LibroBase(BaseModel):
    titulo: str
    editorial: Optional[str] = None
    año_publicacion: Optional[int] = None
    descripcion_libro: Optional[str] = None
    categoria_id: int
    genero: Optional[str] = None
    promedio_calificacion: Optional[float] = 0.0

class LibroCreate(LibroBase):
    pass

class Libro(LibroBase):
    ISBN: int

    class Config:
        from_attributes = True

# 6. LIBRO_AUTOR (relación N:N)
class LibroAutorBase(BaseModel):
    ISBN: int
    id_autor: int

class LibroAutorCreate(LibroAutorBase):
    pass

class LibroAutor(LibroAutorBase):
    class Config:
        from_attributes = True

# 7. LIBRO_ETIQUETA (relación N:N)
class LibroEtiquetaBase(BaseModel):
    ISBN: int
    id_etiqueta: int

class LibroEtiquetaCreate(LibroEtiquetaBase):
    pass

class LibroEtiqueta(LibroEtiquetaBase):
    class Config:
        from_attributes = True

# 8. EJEMPLAR
class EjemplarBase(BaseModel):
    ISBN: int
    ubicacion: Optional[str] = None
    estado: Optional[str] = 'disponible'

class EjemplarCreate(EjemplarBase):
    pass

class Ejemplar(EjemplarBase):
    id_ejemplar: int

    class Config:
        from_attributes = True

# 9. PRÉSTAMO
class PrestamoBase(BaseModel):
    id_usuario: int
    id_ejemplar: int
    fecha_prestamo: date
    fecha_vencimiento: date
    estado: Optional[str] = 'activo'

class PrestamoCreate(PrestamoBase):
    pass

class Prestamo(PrestamoBase):
    id_prestamo: int

    class Config:
        from_attributes = True

# 10. DEVOLUCIÓN
class DevolucionBase(BaseModel):
    id_prestamo: int
    fecha_devolucion: date
    en_retraso: Optional[bool] = False
    dias_retraso: Optional[int] = 0

class DevolucionCreate(DevolucionBase):
    pass

class Devolucion(DevolucionBase):
    id_devolucion: int

    class Config:
        from_attributes = True

# 11. SANCIÓN
class SancionBase(BaseModel):
    id_usuario: int
    motivo: str
    fecha_inicio: date
    fecha_fin: date

class SancionCreate(SancionBase):
    pass

class Sancion(SancionBase):
    id_sancion: int

    class Config:
        from_attributes = True

# 12. RESERVA
class ReservaBase(BaseModel):
    id_usuario: int
    ISBN: int
    fecha_reserva: date
    estado: Optional[str] = 'pendiente'

class ReservaCreate(ReservaBase):
    pass

class Reserva(ReservaBase):
    id_reserva: int

    class Config:
        from_attributes = True

# 13. CALIFICACIÓN
class CalificacionBase(BaseModel):
    ISBN: int
    id_usuario: int
    estrellas: int
    comentario: Optional[str] = None

class CalificacionCreate(CalificacionBase):
    pass

class Calificacion(CalificacionBase):
    id_calificacion: int

    class Config:
        from_attributes = True

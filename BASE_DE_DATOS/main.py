from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from BASE_DE_DATOS.db import SessionLocal, engine, get_db
from BASE_DE_DATOS import models, services, schemas



# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Usuarios
@app.post("/usuarios/", response_model=schemas.UsuarioCreate)
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return services.create_usuario(db, usuario)

@app.get("/usuarios/{usuario_id}", response_model=schemas.UsuarioCreate)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = services.get_usuario(db, usuario_id)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario

@app.put("/usuarios/{usuario_id}", response_model=schemas.UsuarioCreate)
def actualizar_usuario(usuario_id: int, usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = services.update_usuario(db, usuario_id, usuario)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario

@app.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    exito = services.delete_usuario(db, usuario_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"mensaje": "Usuario eliminado exitosamente"}

# Libros
@app.post("/libros/", response_model=schemas.LibroCreate)
def crear_libro(libro: schemas.LibroCreate, db: Session = Depends(get_db)):
    return services.create_libro(db, libro)

@app.get("/libros/{libro_id}", response_model=schemas.LibroCreate)
def obtener_libro(libro_id: int, db: Session = Depends(get_db)):
    db_libro = services.get_libro(db, libro_id)
    if db_libro is None:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return db_libro


@app.put("/libros/{libro_id}", response_model=schemas.LibroCreate)
def actualizar_libro(libro_id: int, libro: schemas.LibroCreate, db: Session = Depends(get_db)):
    db_libro = services.update_libro(db, libro_id, libro)
    if db_libro is None:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return db_libro

@app.delete("/libros/{libro_id}")
def eliminar_libro(libro_id: int, db: Session = Depends(get_db)):
    exito = services.delete_libro(db, libro_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return {"mensaje": "Libro eliminado exitosamente"}

# Autores
@app.post("/autores/", response_model=schemas.AutorCreate)
def crear_autor(autor: schemas.AutorCreate, db: Session = Depends(get_db)):
    return services.create_autor(db, autor)

@app.get("/autores/{autor_id}", response_model=schemas.AutorCreate)
def obtener_autor(autor_id: int, db: Session = Depends(get_db)):
    db_autor = services.get_autor(db, autor_id)
    if db_autor is None:
        raise HTTPException(status_code=404, detail="Autor no encontrado")
    return db_autor

@app.put("/autores/{autor_id}", response_model=schemas.AutorCreate)
def actualizar_autor(autor_id: int, autor: schemas.AutorCreate, db: Session = Depends(get_db)):
    db_autor = services.update_autor(db, autor_id, autor)
    if db_autor is None:
        raise HTTPException(status_code=404, detail="Autor no encontrado")
    return db_autor

@app.delete("/autores/{autor_id}")
def eliminar_autor(autor_id: int, db: Session = Depends(get_db)):
    exito = services.delete_autor(db, autor_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Autor no encontrado")
    return {"mensaje": "Autor eliminado exitosamente"}

# Etiquetas
@app.post("/etiquetas/", response_model=schemas.EtiquetaCreate)
def crear_etiqueta(etiqueta: schemas.EtiquetaCreate, db: Session = Depends(get_db)):
    return services.create_etiqueta(db, etiqueta)

@app.get("/etiquetas/{etiqueta_id}", response_model=schemas.EtiquetaCreate)
def obtener_etiqueta(etiqueta_id: int, db: Session = Depends(get_db)):
    db_etiqueta = services.get_etiqueta(db, etiqueta_id)
    if db_etiqueta is None:
        raise HTTPException(status_code=404, detail="Etiqueta no encontrada")
    return db_etiqueta

@app.put("/etiquetas/{etiqueta_id}", response_model=schemas.EtiquetaCreate)
def actualizar_etiqueta(etiqueta_id: int, etiqueta: schemas.EtiquetaCreate, db: Session = Depends(get_db)):
    db_etiqueta = services.update_etiqueta(db, etiqueta_id, etiqueta)
    if db_etiqueta is None:
        raise HTTPException(status_code=404, detail="Etiqueta no encontrada")
    return db_etiqueta

@app.delete("/etiquetas/{etiqueta_id}")
def eliminar_etiqueta(etiqueta_id: int, db: Session = Depends(get_db)):
    exito = services.delete_etiqueta(db, etiqueta_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Etiqueta no encontrada")
    return {"mensaje": "Etiqueta eliminada exitosamente"}

# Ejemplares
@app.post("/ejemplares/", response_model=schemas.EjemplarCreate)
def crear_ejemplar(ejemplar: schemas.EjemplarCreate, db: Session = Depends(get_db)):
    return services.create_ejemplar(db, ejemplar)

@app.get("/ejemplares/{ejemplar_id}", response_model=schemas.EjemplarCreate)
def obtener_ejemplar(ejemplar_id: int, db: Session = Depends(get_db)):
    db_ejemplar = services.get_ejemplar(db, ejemplar_id)
    if db_ejemplar is None:
        raise HTTPException(status_code=404, detail="Ejemplar no encontrado")
    return db_ejemplar

@app.put("/ejemplares/{ejemplar_id}", response_model=schemas.EjemplarCreate)
def actualizar_ejemplar(ejemplar_id: int, ejemplar: schemas.EjemplarCreate, db: Session = Depends(get_db)):
    db_ejemplar = services.update_ejemplar(db, ejemplar_id, ejemplar)
    if db_ejemplar is None:
        raise HTTPException(status_code=404, detail="Ejemplar no encontrado")
    return db_ejemplar

@app.delete("/ejemplares/{ejemplar_id}")
def eliminar_ejemplar(ejemplar_id: int, db: Session = Depends(get_db)):
    exito = services.delete_ejemplar(db, ejemplar_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Ejemplar no encontrado")
    return {"mensaje": "Ejemplar eliminado exitosamente"}

# Prestamos
@app.post("/prestamos/", response_model=schemas.PrestamoCreate)
def crear_prestamo(prestamo: schemas.PrestamoCreate, db: Session = Depends(get_db)):
    return services.create_prestamo(db, prestamo)

@app.get("/prestamos/{prestamo_id}", response_model=schemas.PrestamoCreate)
def obtener_prestamo(prestamo_id: int, db: Session = Depends(get_db)):
    db_prestamo = services.get_prestamo(db, prestamo_id)
    if db_prestamo is None:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return db_prestamo

@app.put("/prestamos/{prestamo_id}", response_model=schemas.PrestamoCreate)
def actualizar_prestamo(prestamo_id: int, prestamo: schemas.PrestamoCreate, db: Session = Depends(get_db)):
    db_prestamo = services.update_prestamo(db, prestamo_id, prestamo)
    if db_prestamo is None:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return db_prestamo

@app.delete("/prestamos/{prestamo_id}")
def eliminar_prestamo(prestamo_id: int, db: Session = Depends(get_db)):
    exito = services.delete_prestamo(db, prestamo_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    return {"mensaje": "Préstamo eliminado exitosamente"}

# Devoluciones
@app.post("/devoluciones/", response_model=schemas.DevolucionCreate)
def crear_devolucion(devolucion: schemas.DevolucionCreate, db: Session = Depends(get_db)):
    return services.create_devolucion(db, devolucion)

@app.get("/devoluciones/{devolucion_id}", response_model=schemas.DevolucionCreate)
def obtener_devolucion(devolucion_id: int, db: Session = Depends(get_db)):
    db_devolucion = services.get_devolucion(db, devolucion_id)
    if db_devolucion is None:
        raise HTTPException(status_code=404, detail="Devolución no encontrada")
    return db_devolucion

@app.put("/devoluciones/{devolucion_id}", response_model=schemas.DevolucionCreate)
def actualizar_devolucion(devolucion_id: int, devolucion: schemas.DevolucionCreate, db: Session = Depends(get_db)):
    db_devolucion = services.update_devolucion(db, devolucion_id, devolucion)
    if db_devolucion is None:
        raise HTTPException(status_code=404, detail="Devolución no encontrada")
    return db_devolucion

@app.delete("/devoluciones/{devolucion_id}")
def eliminar_devolucion(devolucion_id: int, db: Session = Depends(get_db)):
    exito = services.delete_devolucion(db, devolucion_id)
    if not exito:
        raise HTTPException(status_code=404, detail="Devolución no encontrada")
    return {"mensaje": "Devolución eliminada exitosamente"}
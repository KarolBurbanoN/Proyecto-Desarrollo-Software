from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Conexión a la base de datos PostgreSQL
# IMPORTANTE: Cambiar la contraseña (12345) por la que tengan configurada en su PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123456@localhost:5432/biblioteca_alexandria"

# Se crea el "motor" que se conecta a la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal  = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db(): # Función que nos da una conexión (sesión) a la base de datos
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # Esta conexión se cierra automáticamente cuando se termina de usar

def create_table():
    Base.metadata.create_all(bind=engine)
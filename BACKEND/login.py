# BACKEND/routes/login.py
from flask import Blueprint, request, redirect, session, render_template
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS.models import Usuario
from sqlalchemy.orm import Session
import bcrypt

login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]

    db: Session = next(get_db())

    user = db.query(Usuario).filter(Usuario.correo == email).first()

    if user and bcrypt.checkpw(password.encode("utf-8"), user.contraseña.encode("utf-8")):
        session["usuario"] = user.numero_documento
        return redirect("/dashboard")
    else:
        return "Correo o contraseña incorrectos", 401
    
@login_bp.route("/registro", methods=["POST"])
def registro():
    db: Session = next(get_db())

    tipo_documento = request.form["tipo_documento"]
    numero_documento = request.form["numero_documento"]
    nombres = request.form["nombres"]
    apellidos = request.form["apellidos"]
    fecha_nacimiento = request.form["fecha_nacimiento"]
    genero = request.form.get("genero")
    direccion = request.form.get("direccion")
    ciudad = request.form.get("ciudad")
    telefono = request.form.get("telefono")
    correo = request.form["correo"]
    contraseña = request.form["contraseña"]

    # Verificar si el usuario ya existe
    if db.query(Usuario).filter(Usuario.correo == correo).first():
        return "Ya existe un usuario con este correo", 400

    # Cifrar contraseña
    contraseña_cifrada = bcrypt.hashpw(contraseña.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    rol = "lector"
    
    nuevo_usuario = Usuario(
        tipo_documento=tipo_documento,
        numero_documento=numero_documento,
        nombres=nombres,
        apellidos=apellidos,
        fecha_nacimiento=fecha_nacimiento,
        genero=genero,
        direccion=direccion,
        ciudad=ciudad,
        telefono=telefono,
        correo=correo,
        contraseña=contraseña_cifrada,
        rol=rol  # <-- agregar esto
    )

    db.add(nuevo_usuario)
    db.commit()

    return redirect("/login")

@login_bp.route("/logout")
def logout():
    session.clear()
    return redirect("/login")
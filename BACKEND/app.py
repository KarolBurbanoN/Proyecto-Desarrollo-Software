import sys
import os
import bcrypt
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Blueprint, Flask, jsonify, render_template, request, session, redirect, url_for
from BACKEND.login import login_bp
from flask_cors import CORS
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS import models
from BASE_DE_DATOS.models import Usuario
from BACKEND.usuarios import usuarios_bp


app = Flask(
    __name__,
    template_folder="../FRONTEND/templates",
    static_folder="../FRONTEND"
)

app.secret_key = "clave_secreta"
CORS(app, supports_credentials=True)

# ========== Definir el blueprint y sus rutas PRIMERO ==========
api_bp = Blueprint('api', __name__)

@api_bp.route('/')
def base():
    return jsonify({"status": "API funcionando"})

@api_bp.route('/libros')
def get_libros():
    db = next(get_db())
    libros = db.query(models.Libro).all()
    return jsonify([{
        'ISBN': libro.ISBN,
        'titulo': libro.titulo,
        'autores': [{'nombre': autor.nombre} for autor in libro.autores],
        'portada': libro.portada,
        'promedio_calificacion': float(libro.promedio_calificacion) if libro.promedio_calificacion else 0.0,
        'genero': libro.genero,
        'editorial': libro.editorial
    } for libro in libros])

@api_bp.route('/actualizar-perfil', methods=['POST'])
def actualizar_perfil():
    if 'usuario' not in session:
        return jsonify({'error': 'No autorizado'}), 401
    
    db = next(get_db())
    usuario = db.query(Usuario).filter(Usuario.id_usuario == session['user_id']).first()
    
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    data = request.get_json()
    
    # Actualizar datos
    if 'nombre' in data:
        usuario.nombres = data['nombre']
    if 'email' in data:
        usuario.correo = data['email']
    if 'password' in data and data['password']:
        usuario.contraseña = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    db.commit()
    
    # Actualizar datos en la sesión
    session['usuario_nombre'] = f"{usuario.nombres}"
    session['usuario_email'] = usuario.correo
    session['usuario_rol'] = usuario.rol
    
    return jsonify({'message': 'Perfil actualizado correctamente'})

# ========== Registrar blueprints DESPUÉS de definir todas las rutas ==========
app.register_blueprint(login_bp)
app.register_blueprint(usuarios_bp)

# ========== Rutas principales de la app ==========
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    db = next(get_db())
    if "usuario" not in session:
        return redirect("/login")
    
    usuario = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()
    if not usuario:
        return redirect("/login")
    
    return render_template("dashboard.html", usuario=usuario)

@app.route("/bibliotecario")
def bibliotecario():
    db = next(get_db())
    if "usuario" not in session:
        return redirect("/login")
    
    usuario = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()
    if not usuario:
        return redirect("/login")
    
    return render_template("bibliotecario.html", usuario=usuario)

@app.route("/admin")
def admin():
    db = next(get_db())
    if "usuario" not in session:
        return redirect("/login")
    
    usuario = db.query(Usuario).filter_by(numero_documento=session["usuario"]).first()
    if not usuario:
        return redirect("/login")
    
    return render_template("admin.html", usuario=usuario)

if __name__ == "__main__":
    app.run(debug=True)
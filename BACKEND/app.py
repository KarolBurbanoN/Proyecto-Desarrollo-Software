from flask import Flask, render_template, session, redirect
from BACKEND.login import login_bp
from flask_cors import CORS
from BASE_DE_DATOS.db import get_db
from BASE_DE_DATOS.models import Usuario


app = Flask(
    __name__,
    template_folder="../FRONTEND/templates",
    static_folder="../FRONTEND"
)


app.secret_key = "clave_secreta"
CORS(app)

app.register_blueprint(login_bp)

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

if __name__ == "__main__":
    app.run(debug=True)



# Tutorial para hacer que el Backend (y todo el código) funcione en tu PC

 
## 1. Abre tu terminal de VS Code como administrador

-  **Cierra VS Code** si ya está abierto.

- Haz clic derecho en el ícono de **VS Code** y selecciona "**Ejecutar como administrador**".

- Luego, abre la **terminal integrada**.

## 2. Cambia la política de ejecución temporalmente

En la terminal de VS Code, ejecuta el siguiente comando:
```
Set-ExecutionPolicy  -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Cuando te pregunte si estás seguro, presiona S y luego Enter.

  
## 3. Crea y activa el entorno virtual

🔹 Si NO tienes el entorno virtual (venv) creado:
Ejecuta este comando en la terminal:
```
python -m venv venv
```
Esto creará una carpeta venv con el entorno virtual.

- Ejecuta el siguiente comando:
```
.\venv\Scripts\Activate.ps1
```
Deberías ver algo como (venv) al principio de la línea, indicando que el entorno virtual está activado. La terminal debería verse de color verde.

- Después, instala las librerías necesarias ejecutando:
```
pip install -r requirements.txt
```
Esto instalará todas las dependencias necesarias para que FastAPI funcione correctamente. ✅

**Nota:**

El archivo requirements.txt contiene todas las librerías necesarias para el proyecto, lo que facilita la instalación.

## 4. Crear la base de datos desde la terminal

Para evitar tener que pegar las tablas manualmente en PgAdmin, realizamos el proceso directamente desde Visual Studio Code.


**Pasos para crear la base de datos:**

- Abre PgAdmin.
- Abre los servidores y coloca tu contraseña para acceder al entorno.
- Crea una base de datos llamada: biblioteca_alexandria.

**Luego, en la terminal de VS Code:**

*Si cerraste la terminal, reactiva el entorno virtual con:
```
.\venv\Scripts\Activate.ps1*
```
  **Copia y pega:** 
```
ipython
```
Luego
```
from BASE_DE_DATOS import db, models
```
Y finalmente
```
db.create_table()
```

Si no aparece ningún error, eso significa que las tablas se crearon correctamente. 🎉

Y puedes salir con

- exit

**Verificación:**

Abre PgAdmin y verifica que las tablas hayan sido creadas en la base de datos biblioteca_alexandria.

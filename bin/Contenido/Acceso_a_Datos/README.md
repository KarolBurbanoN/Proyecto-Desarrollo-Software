Aquí está todas las tablas actuales de la base de datos, es necesario crear primero la base de datos con el nombre: biblioteca_alexandria. 

Una vez creada copian y pegan para la espectiva generación de las tablas. 

-- 1. CATEGORÍA
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

-- 2. ETIQUETA
CREATE TABLE etiqueta (
    id_etiqueta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- 3. AUTOR
CREATE TABLE autor (
    id_autor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    biografia VARCHAR(150),
    nacionalidad VARCHAR(50)
);

-- 4. USUARIO
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(50),
    telefono VARCHAR(20),
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('administrador', 'bibliotecario', 'lector')) NOT NULL,
    estado_cuenta VARCHAR(20) CHECK (estado_cuenta IN ('activa', 'bloqueada')) DEFAULT 'activa'
);

-- 5. LIBRO
CREATE TABLE libro (
    ISBN SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    editorial VARCHAR(100),
    año_publicacion INT,
    descripcion_libro VARCHAR(200),
    categoria_id INT REFERENCES categoria(id_categoria),
    genero VARCHAR(50),
    promedio_calificacion NUMERIC(3,2) DEFAULT 0.0 CHECK (promedio_calificacion >= 0.0 AND promedio_calificacion <= 5.0)
);

-- 6. LIBRO_AUTOR (relación N:N)
CREATE TABLE libro_autor (
    ISBN INT REFERENCES libro(ISBN) ON DELETE CASCADE,
    id_autor INT REFERENCES autor(id_autor) ON DELETE CASCADE,
    PRIMARY KEY (ISBN, id_autor)
);

-- 7. LIBRO_ETIQUETA (relación N:N)
CREATE TABLE libro_etiqueta (
    ISBN INT REFERENCES libro(ISBN) ON DELETE CASCADE,
    id_etiqueta INT REFERENCES etiqueta(id_etiqueta) ON DELETE CASCADE,
    PRIMARY KEY (ISBN, id_etiqueta)
);

-- 8. EJEMPLAR
CREATE TABLE ejemplar (
    id_ejemplar SERIAL PRIMARY KEY,
    ISBN INT REFERENCES libro(ISBN) ON DELETE CASCADE,
    ubicacion VARCHAR(100),
    estado VARCHAR(20) CHECK (estado IN ('disponible', 'prestado', 'dañado', 'perdido')) DEFAULT 'disponible'
);

-- 9. PRÉSTAMO
CREATE TABLE prestamo (
    id_prestamo SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_ejemplar INT REFERENCES ejemplar(id_ejemplar),
    fecha_prestamo DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('activo', 'devuelto', 'vencido')) DEFAULT 'activo'
);

-- 10. DEVOLUCIÓN
CREATE TABLE devolucion (
    id_devolucion SERIAL PRIMARY KEY,
    id_prestamo INT REFERENCES prestamo(id_prestamo),
    fecha_devolucion DATE NOT NULL,
    en_retraso BOOLEAN DEFAULT FALSE,
    dias_retraso INT DEFAULT 0
);

-- 11. SANCIÓN
CREATE TABLE sancion (
    id_sancion SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    motivo TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

-- 12. RESERVA
CREATE TABLE reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    ISBN INT REFERENCES libro(ISBN),
    fecha_reserva DATE NOT NULL,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'cancelada', 'completada')) DEFAULT 'pendiente'
);

-- 13. CALIFICACIÓN
CREATE TABLE calificacion (
    id_calificacion SERIAL PRIMARY KEY,
    ISBN INT REFERENCES libro(ISBN),
    id_usuario INT REFERENCES usuario(id_usuario),
    estrellas INT CHECK (estrellas BETWEEN 1 AND 5) NOT NULL,
    comentario TEXT
);

-- 14. AUDITORÍA
CREATE TABLE auditoria (
    id_auditoria SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario),
    accion TEXT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

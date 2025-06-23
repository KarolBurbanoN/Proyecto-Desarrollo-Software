let currentPage = 1;
const booksPerPage = 10;
let usuarios = [];
let usuariosFiltrados = [];
let paginaActualUsuarios = 1;
const usuariosPorPagina = 5;
let books = [];

let filteredBooks = null;

//?-----------------------------/
//?---- GESTIONAR USUARIOS ----/
//?----------------------------/

//* Funciones Inicializadoras

function mostrarSeccionUsuarios(seccion) {
  document.querySelectorAll('.user-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#seccion-listar-usuarios, #seccion-agregar-usuario').forEach(div => div.classList.add('hidden-section'));

  if (seccion === 'listar') {
    document.querySelector('.user-tab:nth-child(1)').classList.add('active');
    document.getElementById('seccion-listar-usuarios').classList.remove('hidden-section');
  } else {
    document.querySelector('.user-tab:nth-child(2)').classList.add('active');
    document.getElementById('seccion-agregar-usuario').classList.remove('hidden-section');
  }

  if (seccion === 'agregar') {
    
    document.getElementById('modo-edicion').value = "false";
    document.getElementById('usuario-editando-doc').value = "";
    document.getElementById('numDoc').readOnly = false;
    document.querySelector('.form').reset();
  }
}

function renderUsuarios() {
  const contenedor = document.getElementById('listaUsuarios');
  contenedor.innerHTML = '';

  const searchInput = document.getElementById('search-usuarios');
  const busqueda = searchInput ? searchInput.value.toLowerCase() : '';
  const filtroEstado = document.getElementById('filter-estado-usuario').value;

  // 1. Filtro base (simplificado)
  usuariosFiltrados = usuarios.filter(usuario => {
    // Verificar coincidencia con búsqueda
    const coincideBusqueda = 
      (usuario.nombres?.toLowerCase().includes(busqueda) || 
      (usuario.apellidos?.toLowerCase().includes(busqueda)) || 
      (usuario.numero_documento?.includes(busqueda)) || 
      (usuario.correo?.toLowerCase().includes(busqueda)) )|| 
      (busqueda === '');

    // Verificar filtro por estado
    const coincideEstado = 
      (filtroEstado === 'todos') || 
      (filtroEstado === 'activo' && usuario.estado?.toLowerCase() === 'activa') ||
      (filtroEstado === 'bloqueado' && usuario.estado?.toLowerCase() === 'bloqueada');

    return coincideBusqueda && coincideEstado;
  });

  // 2. Paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const inicio = (paginaActualUsuarios - 1) * usuariosPorPagina;
  const pagina = usuariosFiltrados.slice(inicio, inicio + usuariosPorPagina);

  // 3. Crear tabla
  const tabla = document.createElement('div');
  tabla.className = 'usuarios-table';

  // Crear encabezado
  const header = document.createElement('div');
  header.className = 'row header';
  header.innerHTML = `
    <div>Nombre</div>
    <div>Documento</div>
    <div>Correo</div>
    <div>Tipo de Usuario</div>
    <div>Estado</div>
    <div>Acciones</div>
  `;
  tabla.appendChild(header);

  // 4. Render tabla
  if (pagina.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'row empty';
    emptyRow.innerHTML = '<div colspan="5">No hay usuarios registrados.</div>';
    tabla.appendChild(emptyRow);
  } else {
    pagina.forEach(usuario => {
      const row = document.createElement('div');
      row.className = 'row';

      // Formatear estado con color
      const estadoClass = usuario.estado === 'activa' ? 'estado-activo' : 'estado-bloqueado';
      const estadoText = usuario.estado === 'activa' ? 'Activa' : 'Bloqueada';

      row.innerHTML = `
        <div>${usuario.nombres} ${usuario.apellidos}</div>
        <div>${usuario.numero_documento}</div>
        <div>${usuario.correo}</div>
        <div>${usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</div>
        <div><span class="${estadoClass}">${estadoText}</span></div>
        <div class="acciones">
          <button class="edit" title="Editar" onclick="editarUsuario('${usuario.numero_documento}')">
            <i class='bx bx-edit'></i>
          </button>
          <button class="block" title="${usuario.estado === 'activa' ? 'Bloquear' : 'Desbloquear'}" onclick="toggleEstadoUsuario('${usuario.numero_documento}')">
            <i class='bx bx-block'></i>
          </button>
          <button class="delete" title="Eliminar" onclick="eliminarUsuario('${usuario.numero_documento}')">
            <i class='bx bx-trash'></i>
          </button>
        </div>
      `;
      tabla.appendChild(row);
    });
  }

  contenedor.appendChild(tabla);
  document.getElementById('paginadorUsuarios').textContent = `Página ${paginaActualUsuarios} de ${totalPaginas}`;
}

//* Base de Datos

async function renderUsuariosDesdeBackend() {
  try {
    const response = await fetch("/api/usuarios/");
    const data = await response.json();
    // Filtrar para mostrar solo lectores
    usuarios = data.filter(u => u.rol === 'lector');
    renderUsuarios();
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

//* Funciones de Interacción

function editarUsuario(doc) {
  const usuario = usuarios.find(u => u.numero_documento === doc);
  if (!usuario) return;

  // Activar pestaña de formulario
  mostrarSeccionUsuarios('agregar');

  // Configurar modo edición
  document.getElementById('modo-edicion').value = "true";
  document.getElementById('usuario-editando-doc').value = doc;

  // Llenar formulario con datos del usuario
  document.getElementById('numDoc').value = usuario.numero_documento;
  document.querySelector('select[name="tipo_documento"]').value = usuario.tipo_documento;
  document.getElementById('nombres').value = usuario.nombres;
  document.getElementById('apellidos').value = usuario.apellidos;
  document.getElementById('fecha').value = usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '';
  document.getElementById('genero').value = usuario.genero;
  document.getElementById('direccion').value = usuario.direccion || '';
  document.getElementById('ciudad').value = usuario.ciudad || '';
  document.getElementById('telefono').value = usuario.telefono || '';
  document.getElementById('correo').value = usuario.correo;
  document.getElementById('rol').value = usuario.rol;
  
  // Bloquear campo de documento (no editable)
  document.getElementById('numDoc').readOnly = true;

  // Cambiar texto del botón de submit
  const submitBtn = document.querySelector('#formUsuario button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = "Actualizar Usuario";
    submitBtn.classList.add('update-btn');
  }

  // Cambiar el evento del formulario para usar actualización
  const form = document.getElementById('formUsuario');
  if (form) {
    form.onsubmit = async function(e) {
      e.preventDefault();
      await registrarUsuario(e); // Reutilizamos la misma función pero ahora hará PUT
    };
  }
}

async function eliminarUsuario(doc) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

  try {
    const response = await fetch(`/api/usuarios/${doc}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar usuario");
    }

    // Mostrar mensaje de éxito
    const mensaje = document.getElementById("mensajeRegistro");
    mensaje.textContent = "✅ Usuario eliminado correctamente";
    mensaje.style.display = "block";

    // Actualizar lista de usuarios
    await renderUsuariosDesdeBackend();

    // Ocultar mensaje después de 2 segundos
    setTimeout(() => {
      mensaje.style.display = "none";
    }, 2000);

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    showErrorNotification('Error', 'Ocurrió un error al eliminar el usuario: ' + error.message);
  }
}

async function registrarUsuario(event) {
  event.preventDefault();

  const usuario = {
    tipo_documento: document.querySelector('select[name="tipo_documento"]').value,
    numero_documento: document.getElementById("numDoc").value,
    nombres: document.getElementById("nombres").value,
    apellidos: document.getElementById("apellidos").value,
    fecha_nacimiento: document.getElementById("fecha").value,
    genero: document.getElementById("genero").value,
    direccion: document.getElementById("direccion").value,
    ciudad: document.getElementById("ciudad").value,
    telefono: document.getElementById("telefono").value,
    correo: document.getElementById("correo").value,
    contraseña: document.querySelector('input[name="contraseña"]').value,
    rol: "lector", // Forzar el rol lector
    estado: "activa"
  };

  const modoEdicion = document.getElementById("modo-edicion").value === "true";

  const url = modoEdicion
    ? `/api/usuarios/${usuario.numero_documento}`
    : "/api/usuarios/";

  const metodo = modoEdicion ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en el registro");
    }

    const result = await response.json();

    // Mostrar mensaje de éxito
    const mensaje = document.getElementById("mensajeRegistro");
    mensaje.textContent = modoEdicion ? "✅ Usuario actualizado correctamente" : "✅ Usuario registrado correctamente";
    mensaje.style.display = "block";

    // Resetear formulario si no es edición
    if (!modoEdicion) {
      document.querySelector(".form").reset();
    }

    // Actualizar lista de usuarios
    renderUsuariosDesdeBackend();

    // Volver a la lista después de 2 segundos
    setTimeout(() => {
      mensaje.style.display = "none";
      mostrarSeccionUsuarios("listar");
    }, 2000);
  } catch (error) {
    showErrorNotification('Error', 'Ocurrió un error al guardar el usuario: ' + error.message);
    console.error(error);
  }
}

//* Funciones de paginación para usuarios

function paginaSiguienteUsuarios() {
  const total = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  if (paginaActualUsuarios < total) {
    paginaActualUsuarios++;
    renderUsuarios();
  }
}

function paginaAnteriorUsuarios() {
  if (paginaActualUsuarios > 1) {
    paginaActualUsuarios--;
    renderUsuarios();
  }
}

async function toggleEstadoUsuario(doc) {
  try {
    const usuario = usuarios.find(u => u.numero_documento === doc);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const nuevoEstado = usuario.estado === 'activa' ? 'bloqueada' : 'activa';
    const accion = nuevoEstado === 'bloqueada' ? 'bloquear' : 'desbloquear';
    
    const confirmacion = confirm(`¿${nuevoEstado === 'bloqueada' ? 'Bloquear' : 'Desbloquear'} a ${usuario.nombres}?`);
    if (!confirmacion) return;

    const response = await fetch(`/api/usuarios/${doc}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al cambiar estado");
    }
    
    usuario.estado = nuevoEstado;
    renderUsuarios();
    showSuccessNotification('Éxito', `Usuario ${nuevoEstado === 'bloqueada' ? 'bloqueado' : 'activado'}`);

  } catch (error) {
    console.error("Error al cambiar estado:", error);
    showErrorNotification('Error', error.message);
  } finally {
    // Restaurar botón
    if (boton) {
      boton.innerHTML = iconoOriginal;
      boton.disabled = false;
    }
  }
}

//?----------------------------/
//?----- GESTIONAR LIBROS -----/
//?----------------------------/

//* Funciones Inicializadoras

function mostrarSeccionLibros(seccion) {
  const tabs = document.querySelectorAll('#gestion-libros .user-tab');
  tabs.forEach(btn => btn.classList.remove('active'));

  const secciones = [
    '#seccion-listar-libros',
    '#seccion-agregar-libro',
    '#seccion-listar-autores',
    '#seccion-agregar-autor'
  ];

  secciones.forEach(id => document.querySelector(id).classList.add('hidden-section'));

  if (seccion === 'listar') {
    tabs[0].classList.add('active');
    document.getElementById('seccion-listar-libros').classList.remove('hidden-section');
    renderBooksBibliotecario();
  } else if (seccion === 'agregar') {
    tabs[1].classList.add('active');
    document.getElementById('seccion-agregar-libro').classList.remove('hidden-section');
    document.getElementById('formLibro').reset();
    document.getElementById("previewPortada").style.display = "none";
  } else if (seccion === 'listar_autores') {
    tabs[2].classList.add('active');
    document.getElementById('seccion-listar-autores').classList.remove('hidden-section');
    listarAutores();
  } else if (seccion === 'agregar_autor') {
    tabs[3].classList.add('active');
    document.getElementById('seccion-agregar-autor').classList.remove('hidden-section');
    document.getElementById('formAutor').reset();

    const form = document.getElementById("formAutor");
    form.dataset.editando = "false";
    form.dataset.idAutor = "";
    form.querySelector('button[type="submit"]').textContent = "Registrar autor";
  }
}

function mostrarFormularioLibro() {
  const formSection = document.getElementById('formularioLibro');
  formSection.classList.toggle('hidden-section');
}

//* Base de Datos
async function renderBooksBibliotecario() {
  try {
    const response = await fetch('/api/libros');
    if (!response.ok) throw new Error('Error al obtener los libros');

    books = await response.json();

    const bookList = document.getElementById('BibliotecarioBookList');
    bookList.innerHTML = '';

    // Obtener valores de los filtros
    const search = document.getElementById('search-Bibliotecario').value.toLowerCase();
    const category = document.getElementById('filter-category-Bibliotecario').value;
    const minRating = parseFloat(document.getElementById('filter-rating-Bibliotecario').value) || 0;
    const order = document.getElementById('filter-order-Bibliotecario').value;

    // Aplicar filtros
    let filtered = books.filter(book => {
      const title = book.titulo?.toLowerCase() || '';
      const authors = Array.isArray(book.autores) ? book.autores.map(a => a.nombre.toLowerCase()).join(' ') : '';
      const genero = (book.genero || '').toLowerCase();
      const rating = book.promedio_calificacion || 0;

      const matchesSearch = title.includes(search) || authors.includes(search);
      const matchesCategory = category === 'all' || genero === category.toLowerCase();
      const matchesRating = rating >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });

    // Función para parsear fecha de libro
    function parseFechaLibro(libro) {
      return new Date(libro.fecha_agregado || libro.año_publicacion || '2000-01-01');
    }

    // Aplicar orden
    if (order === 'recent') {
      filtered.sort((a, b) => parseFechaLibro(b) - parseFechaLibro(a));
    } else if (order === 'oldest') {
      filtered.sort((a, b) => parseFechaLibro(a) - parseFechaLibro(b));
    } else if (order === 'rating') {
      filtered.sort((a, b) => (b.promedio_calificacion || 0) - (a.promedio_calificacion || 0));
    }

    // Paginación
    const totalPages = Math.ceil(filtered.length / booksPerPage);
    if (currentPage > totalPages) {
      currentPage = Math.max(1, totalPages);
    }

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginated = filtered.slice(start, end);

    // Renderizar libros
    if (paginated.length === 0) {
      bookList.innerHTML = '<p class="no-results">No se encontraron libros que coincidan con los filtros.</p>';
    } else {
      paginated.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book';

        const rating = book.promedio_calificacion || 0;
        const portada = book.portada || 'https://via.placeholder.com/150';

        const autores = Array.isArray(book.autores) ?
          book.autores.map(a => a.nombre).join(', ') : 'Autor desconocido';

        div.innerHTML = `
          <img src="${portada}" alt="${book.titulo}" 
              onclick="showBibliotecarioBookDetails('${book.ISBN}')"
              style="cursor:pointer; width: 120px; height: auto; display: block; margin: 0 auto;">
        `;
        
        bookList.appendChild(div);
      });
    }

    document.getElementById('pageIndicator').innerText =
      `Página ${currentPage} de ${Math.max(1, totalPages)}`;
  } catch (error) {
    console.error('Error al cargar libros:', error);
    document.getElementById('BibliotecarioBookList').innerHTML =
      '<p class="error">Error al cargar los libros. Intente nuevamente.</p>';
  }
}

// Nueva función específica para el panel de bibliotecario
async function showBibliotecarioBookDetails(isbn) {
  try {
    const response = await fetch(`/api/libros/${isbn}`);
    if (!response.ok) throw new Error('Libro no encontrado');
    const book = await response.json();

    // Actualizar todos los campos del panel de detalles
    document.getElementById('detailCover').src = book.portada || 'https://via.placeholder.com/150';
    document.getElementById('detailTitle').textContent = book.titulo;
    document.getElementById('detailISBN').textContent = book.ISBN;
    document.getElementById('detailAuthor').textContent = 
      Array.isArray(book.autores) ? book.autores.map(a => a.nombre).join(', ') : 'Autor desconocido';
    document.getElementById('detailGenero').textContent = book.genero || 'No especificado';
    document.getElementById('detailEditorial').textContent = book.editorial || 'No especificada';
    document.getElementById('detailAnio').textContent = book.año_publicacion || 'No especificado';
    document.getElementById('detailStatus').textContent = book.estado || 'Disponible';
    document.getElementById('detailLocation').textContent = book.ubicacion || 'No especificada';
    document.getElementById('detailRating').textContent = book.promedio_calificacion ? 
      '⭐'.repeat(Math.round(book.promedio_calificacion)) + ` (${book.promedio_calificacion.toFixed(1)})` : 'Sin calificaciones';
    document.getElementById('detailDescription').textContent = book.descripcion_libro || 'No hay descripción disponible.';
    
    // Botones de administración
    document.getElementById('detailButton').innerHTML = `
      <div class="bibliotecario-buttons">
        <button onclick="editarLibro('${book.ISBN}')">Editar</button>
        <button onclick="eliminarLibro('${book.ISBN}')" class="delete-btn">Eliminar</button>
      </div>
    `;
    
    // Mostrar el panel
    const panel = document.getElementById('bookDetailPanel');
    panel.classList.add('active');
    panel.classList.remove('hidden-section');
    
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    showErrorNotification('Error', 'No se pudieron cargar los detalles del libro: ' + error.message);
  }
}

//* Funciones de Interacción

// Configurar eventos de los filtros para bibliotecario
function setupBibliotecarioFilterEvents() {
  // Evento para mostrar/ocultar menú de filtros
  const filterToggle = document.getElementById('filterToggleBtn-Bibliotecario');
  const filtersMenu = document.getElementById('filtersMenu-Bibliotecario');

  if (filterToggle && filtersMenu) {
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el clic se propague
      filtersMenu.classList.toggle('hidden');
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (e) => {
      if (!filtersMenu.contains(e.target) && e.target !== filterToggle) {
        filtersMenu.classList.add('hidden');
      }
    });
  }

  // Evento para aplicar filtros
  document.getElementById('applyFiltersBtn-Bibliotecario').addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1;
    renderBooksBibliotecario();
    document.getElementById('filtersMenu-Bibliotecario').classList.add('hidden');
  });

  // Evento de búsqueda
  document.getElementById('search-Bibliotecario').addEventListener('input', () => {
    currentPage = 1;
    renderBooksBibliotecario();
  });

  // Eventos para cambios en los select de filtros
  document.getElementById('filter-category-Bibliotecario').addEventListener('change', () => {
    currentPage = 1;
    renderBooksBibliotecario();
  });

  document.getElementById('filter-rating-Bibliotecario').addEventListener('change', () => {
    currentPage = 1;
    renderBooksBibliotecario();
  });

  document.getElementById('filter-order-Bibliotecario').addEventListener('change', () => {
    currentPage = 1;
    renderBooksBibliotecario();
  });
}

// Configurar eventos de los filtros para usuarios
// Función mejorada para configurar filtros de usuarios
function setupUserFilterEvents() {
  const filterToggle = document.getElementById('filterToggleBtn-usuarios');
  const filtersMenu = document.getElementById('filtersMenu-usuarios');

  if (!filterToggle || !filtersMenu) {
    console.error('Elementos de filtro de usuarios no encontrados');
    return;
  }

  filterToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    filtersMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!filtersMenu.contains(e.target) && e.target !== filterToggle) {
      filtersMenu.classList.add('hidden');
    }
  });

  const aplicarFiltrosBtn = document.getElementById('aplicarFiltrosUsuarios');
  if (aplicarFiltrosBtn) {
    aplicarFiltrosBtn.addEventListener('click', (e) => {
      e.preventDefault();
      paginaActualUsuarios = 1;
      renderUsuarios();
      filtersMenu.classList.add('hidden');
    });
  }

  const searchInput = document.getElementById('search-usuarios');
  const estadoFilter = document.getElementById('filter-estado-usuario');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      paginaActualUsuarios = 1;
      renderUsuarios();
    });
  }

  if (estadoFilter) {
    estadoFilter.addEventListener('change', () => {
      paginaActualUsuarios = 1;
      renderUsuarios();
    });
  }
}

function closeDetailPanel() {
  document.getElementById('bookDetailPanel').classList.remove('active');
}

async function registrarLibro(event) {
  const form = document.getElementById('formLibro');
  if (form.dataset.modo === "edicion") {
    await actualizarLibro(event);
    return;
  }
  
  const nuevoLibro = {
    titulo: document.getElementById('tituloLibro').value.trim(),
    autores: [document.getElementById('autorLibro').value.trim()],
    editorial: document.getElementById('editorialLibro').value.trim(),
    year: parseInt(document.getElementById('anioLibro').value),
    ISBN: document.getElementById('isbnLibro').value.trim(),
    genero: document.getElementById('generoLibro').value.trim(),
    portada: document.getElementById('urlPortadaLibro').value.trim(),
    descripcion_libro: document.getElementById('descripcionLibro').value.trim(),
    ubicacion: document.getElementById('ubicacionLibro').value.trim(), // nuevo campo
    estado: 'disponible' // opcionalmente personalizable
  };

  try {
    const response = await fetch('/api/libros/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoLibro)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al registrar el libro");
    }

    // 1. RESETEAR FORMULARIO SIN OCULTARLO
    document.getElementById('formLibro').reset();

    // 2. LIMPIAR PREVIEW DE PORTADA
    document.getElementById("previewPortada").src = "";
    document.getElementById("previewPortada").style.display = "none";

    // 3. MOSTRAR MENSAJE DE ÉXITO
    document.getElementById('mensajeLibro').textContent = "✅ Libro registrado correctamente";
    document.getElementById('mensajeLibro').style.display = 'block';

    // 4. OCULTAR MENSAJE DE ERROR SI ESTABA VISIBLE
    document.getElementById('mensajeErrorLibro').style.display = 'none';

    // Actualizar la lista de libros
    renderBooksBibliotecario();

    setTimeout(() => {
      document.getElementById('mensajeLibro').style.display = 'none';
    }, 3000);

  } catch (err) {
    console.error("Error al registrar libro:", err);
    document.getElementById('mensajeErrorLibro').textContent = `❌ ${err.message}`;
    document.getElementById('mensajeErrorLibro').style.display = 'block';

    setTimeout(() => {
      document.getElementById('mensajeErrorLibro').style.display = 'none';
    }, 3000);
  }
}

async function editarLibro(isbn) {
  try {
    // 1. Cerrar el panel de detalles si está abierto
    closeDetailPanel();
    
    // 2. Mostrar la pestaña de agregar libro (que usaremos para edición)
    mostrarSeccionLibros('agregar');
    
    // 3. Obtener datos del libro
    const response = await fetch(`/api/libros/${isbn}`);
    if (!response.ok) throw new Error('Libro no encontrado');
    const book = await response.json();
    
    // 4. Rellenar el formulario con los datos del libro
    document.getElementById('tituloLibro').value = book.titulo;
    document.getElementById('autorLibro').value = book.autores.map(a => a.nombre).join(', ');
    document.getElementById('editorialLibro').value = book.editorial;
    document.getElementById('anioLibro').value = book.año_publicacion || '';
    document.getElementById('isbnLibro').value = book.ISBN;
    document.getElementById('generoLibro').value = book.genero;
    document.getElementById('urlPortadaLibro').value = book.portada || '';
    document.getElementById('descripcionLibro').value = book.descripcion_libro || '';
    document.getElementById('ubicacionLibro').value = book.ubicacion || '';
    
    // 5. Actualizar vista previa de la portada
    const preview = document.getElementById("previewPortada");
    if (book.portada) {
      preview.src = book.portada;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
    
    // 6. Configurar el formulario para modo edición
    const form = document.getElementById('formLibro');
    form.dataset.modo = "edicion";
    form.dataset.isbn = isbn;
    
    // 7. Cambiar texto del botón de submit
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Actualizar Libro";
    }
    
    // 8. Hacer scroll suave al formulario
    form.scrollIntoView({
      behavior: 'smooth'
    });
    
  } catch (error) {
    console.error('Error al editar libro:', error);
    document.getElementById('mensajeErrorLibro').textContent = `❌ ${error.message}`;
    document.getElementById('mensajeErrorLibro').style.display = 'block';
    setTimeout(() => {
      document.getElementById('mensajeErrorLibro').style.display = 'none';
    }, 3000);
  }
}

async function actualizarLibro(event) {
  event.preventDefault();
  
  const form = document.getElementById('formLibro');
  const isModoEdicion = form.dataset.modo === "edicion";
  const isbn = form.dataset.isbn;
  
  if (!isModoEdicion || !isbn) {
    // Si no está en modo edición, registrar como nuevo libro
    await registrarLibro(event);
    return;
  }
  
  // Ocultar mensajes anteriores
  document.getElementById('mensajeLibro').style.display = 'none';
  document.getElementById('mensajeErrorLibro').style.display = 'none';
  
  const libroActualizado = {
    titulo: document.getElementById('tituloLibro').value.trim(),
    autores: [document.getElementById('autorLibro').value.trim()],
    editorial: document.getElementById('editorialLibro').value.trim(),
    year: parseInt(document.getElementById('anioLibro').value) || null,
    genero: document.getElementById('generoLibro').value.trim(),
    portada: document.getElementById('urlPortadaLibro').value.trim(),
    descripcion_libro: document.getElementById('descripcionLibro').value.trim(),
    ubicacion: document.getElementById('ubicacionLibro').value.trim(),
    estado: document.getElementById('estadoLibro').value
  };

  try {
    const response = await fetch(`/api/libros/${isbn}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libroActualizado)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al actualizar el libro");
    }

    // Mostrar mensaje de éxito
    document.getElementById('mensajeLibro').textContent = "✅ Libro actualizado correctamente";
    document.getElementById('mensajeLibro').style.display = 'block';
    
    // Actualizar la lista de libros
    await renderBooksBibliotecario();
    
    // Resetear formulario
    form.reset();
    form.dataset.modo = "";
    form.dataset.isbn = "";
    
    // Cambiar texto del botón de vuelta a "Registrar"
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Registrar Libro";
    }
    
    // Ocultar vista previa de portada
    document.getElementById("previewPortada").style.display = "none";
    
    // Volver a la lista después de 2 segundos
    setTimeout(() => {
      document.getElementById('mensajeLibro').style.display = 'none';
      mostrarSeccionLibros('listar');
    }, 2000);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('mensajeErrorLibro').textContent = `❌ ${error.message}`;
    document.getElementById('mensajeErrorLibro').style.display = 'block';
  }
}

async function eliminarLibro(isbn) {
  if (!confirm(`¿Estás seguro de querer eliminar este libro?`)) return;

  try {
    const response = await fetch(`/api/libros/${isbn}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el libro');
    }

    showSuccessNotification('Libro eliminado', 'Libro eliminado correctamente');
    renderBooksBibliotecario();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error:', error);
    showErrorNotification('Error', 'Error al eliminar el libro: ' + error.message);
  }
}

function nextPageBibliotecario() {
  currentPage++;
  renderBooksBibliotecario();
}

function prevPageBibliotecario() {
  if (currentPage > 1) {
    currentPage--;
    renderBooksBibliotecario();
  }
}

//?----------------------------/
//?---- GESTIONAR AUTORES -----/
//?----------------------------/

async function registrarAutor(event) {
  event.preventDefault();

  const autor = {
    nombre: document.getElementById("nombreAutor").value.trim(),
    biografia: document.getElementById("biografiaAutor").value.trim(),
    nacionalidad: document.getElementById("nacionalidadAutor").value.trim()
  };

  const form = document.getElementById("formAutor");
  const modoEdicion = form.dataset.editando === "true";
  const idAutor = form.dataset.idAutor;

  const url = modoEdicion
    ? `/api/libros/autores/${idAutor}`
    : "/api/libros/autores";
  const metodo = modoEdicion ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(autor)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Error al guardar autor");

    document.getElementById("mensajeAutor").textContent = modoEdicion 
      ? "✅ Autor actualizado correctamente" 
      : "✅ Autor registrado correctamente";
    document.getElementById("mensajeAutor").style.display = "block";
    document.getElementById("mensajeErrorAutor").style.display = "none";
    form.reset();

    // Resetear modo edición
    delete form.dataset.editando;
    delete form.dataset.idAutor;
    document.querySelector('#formAutor button[type="submit"]').textContent = "Registrar autor";

    listarAutores();

    setTimeout(() => document.getElementById("mensajeAutor").style.display = "none", 3000);
  } catch (err) {
    document.getElementById("mensajeErrorAutor").textContent = `❌ ${err.message}`;
    document.getElementById("mensajeErrorAutor").style.display = "block";
    setTimeout(() => document.getElementById("mensajeErrorAutor").style.display = "none", 4000);
  }
}

async function listarAutores() {
  try {
    const response = await fetch("/api/libros/autores");
    if (!response.ok) throw new Error('Error al cargar autores');
    
    const autores = await response.json();
    const contenedor = document.getElementById("listaAutores");
    
    if (!contenedor) {
      console.error('Elemento listaAutores no encontrado');
      return;
    }

    contenedor.innerHTML = autores.length === 0 
      ? "<p>No hay autores registrados.</p>"
      : autores.map(autor => `
          <div class="row">
            <div>${autor.nombre}</div>
            <div>${autor.nacionalidad || "No especificada"}</div>
            <div>${autor.biografia || "Sin biografía"}</div>
            <div>${autor.libros?.join(', ') || 'N/A'}</div>
            <div class="acciones">
              <button class="edit" onclick="editarAutor('${autor.id_autor}')">
                <i class='bx bx-edit'></i>
              </button>
              <button class="delete" onclick="eliminarAutor('${autor.id_autor}')">
                <i class='bx bx-trash'></i>
              </button>
            </div>
          </div>
        `).join('');
        
  } catch (error) {
    console.error('Error:', error);
    const contenedor = document.getElementById("listaAutores");
    if (contenedor) {
      contenedor.innerHTML = `<p class="error">Error al cargar autores: ${error.message}</p>`;
    }
  }
}

async function editarAutor(id) {
  try {
    const response = await fetch(`/api/libros/autores/${id}`);
    if (!response.ok) throw new Error('Error al obtener el autor');

    const autor = await response.json();

    // Mostrar sección de formulario
    mostrarSeccionLibros('agregar_autor');

    // Rellenar campos
    document.getElementById('nombreAutor').value = autor.nombre;
    document.getElementById('nacionalidadAutor').value = autor.nacionalidad || '';
    document.getElementById('biografiaAutor').value = autor.biografia || '';

    // Marcar modo edición
    document.getElementById('formAutor').dataset.editando = "true";
    document.getElementById('formAutor').dataset.idAutor = id;

    // Cambiar texto del botón si quieres
    document.querySelector('#formAutor button[type="submit"]').textContent = "Actualizar autor";

  } catch (err) {
    showErrorNotification('Error', 'No se pudo cargar el autor: ' + error.message);
    console.error(err);
  }
}

async function eliminarAutor(id) {
  if (!confirm("¿Estás seguro de eliminar este autor?")) return;

  try {
    const response = await fetch(`/api/libros/autores/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Error al eliminar autor");
    }

    // Mostrar notificación de éxito
    showSuccessNotification('Éxito', 'Autor eliminado correctamente');
    
    // Actualizar la lista de autores
    await listarAutores();
    
    // Opcional: Volver a la pestaña de listar autores
    mostrarSeccionLibros('listar_autores');
    
  } catch (error) {
    console.error("Error al eliminar autor:", error);
    showErrorNotification('Error', error.message);
  }
}

//?----------------------------/
//?----- GESTIONAR PERFIL -----/
//?----------------------------/

function mostrarFormularioPerfil() {
  document.getElementById('perfilResumen').classList.add('hidden-section');
  document.getElementById('edit-profile-form').classList.remove('hidden-section');

  // Llenar formulario con los datos actuales del resumen
  document.getElementById('edit-nombre').value = document.getElementById('resumen-nombre').textContent;
  document.getElementById('edit-apellidos').value = document.getElementById('resumen-apellidos').textContent;
  document.getElementById('edit-email').value = document.getElementById('resumen-email').textContent;
  document.getElementById('edit-address').value = document.getElementById('resumen-direccion').textContent;
  document.getElementById('edit-phone').value = document.getElementById('resumen-telefono').textContent;
  document.getElementById('edit-city').value = document.getElementById('resumen-ciudad').textContent;

  const genero = document.getElementById('resumen-genero').textContent.toLowerCase();
  document.querySelectorAll('input[name="genero"]').forEach(radio => {
    radio.checked = radio.value === genero.charAt(0);
  });
}

function cancelarEdicionPerfil() {
  document.getElementById('edit-profile-form').classList.add('hidden-section');
  document.getElementById('perfilResumen').classList.remove('hidden-section');
}

async function editProfile(event) {
  event.preventDefault();

  // Obtener los datos del formulario
  const formData = {
    nombres: document.getElementById('edit-nombre').value,
    apellidos: document.getElementById('edit-apellidos').value,
    correo: document.getElementById('edit-email').value,
    genero: document.querySelector('input[name="genero"]:checked').value,
    direccion: document.getElementById('edit-address').value,
    telefono: document.getElementById('edit-phone').value,
    ciudad: document.getElementById('edit-city').value
  };

  // Agregar contraseña solo si se proporcionó
  const nuevaContraseña = document.getElementById('edit-pass').value;
  if (nuevaContraseña) {
    formData.contraseña = nuevaContraseña;
  }

  try {
    // Enviar los datos al servidor
    const response = await fetch('/api/usuarios/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include' // Para incluir las cookies de sesión
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }

    const data = await response.json();

    // Actualizar la vista con los nuevos datos
    document.getElementById('resumen-nombre').textContent = data.usuario.nombres;
    document.getElementById('resumen-apellidos').textContent = data.usuario.apellidos;
    document.getElementById('resumen-email').textContent = data.usuario.correo;
    document.getElementById('resumen-direccion').textContent = data.usuario.direccion;
    document.getElementById('resumen-telefono').textContent = data.usuario.telefono;
    document.getElementById('resumen-ciudad').textContent = data.usuario.ciudad;
    document.getElementById('resumen-genero').textContent =
      data.usuario.genero === 'M' ? 'Masculino' :
        data.usuario.genero === 'F' ? 'Femenino' : 'Otro';

    // Mostrar mensaje de éxito
    showSuccessNotification('Perfil actualizado', 'Perfil actualizado correctamente');

    // Volver a la vista de resumen
    cancelarEdicionPerfil();

  } catch (error) {
    console.error('Error:', error);
    showErrorNotification('Error', 'Error al actualizar el perfil: ' + error.message);
  }
}

//?----------------------------/
//?---------- LOGOUT ----------/
//?----------------------------/

function logout() {
  alert('Sesión cerrada.');
  // Puedes usar location.reload() si quieres refrescar la página
}

//* Navegación sidebar
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('main section').forEach(section => {
      section.classList.add('hidden-section');
      section.classList.remove('active-section');
    });

    const targetId = btn.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);

    // Aseguramos que la sección existe
    if (targetSection) {
      targetSection.classList.remove('hidden-section');
      targetSection.classList.add('active-section');
    }
  });
});

document.getElementById('search-Bibliotecario').addEventListener('input', () => {
  currentPage = 1;
  renderBooksBibliotecario();
});

// Cierre automático del panel de detalles al hacer clic fuera
document.addEventListener('click', (e) => {
  const panel = document.getElementById('bookDetailPanel');
  const isActive = panel.classList.contains('active');

  // Si está visible y el clic fue fuera del panel, lo cerramos
  if (isActive && !panel.contains(e.target)) {
    panel.classList.remove('active');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  renderUsuariosDesdeBackend();
  setupUserFilterEvents(); // <-- Esta línea es crucial
  setupBibliotecarioFilterEvents(); // <-- No olvides esta
  renderBooksBibliotecario();
  listarAutores();

  const formLibro = document.getElementById('formLibro');
  if (formLibro) {
    formLibro.addEventListener('submit', async function(e) {
      e.preventDefault();
      await actualizarLibro(e);
    });
  }

});
let currentPage = 1;
const booksPerPage = 10;
let usuarios = [];
let usuariosFiltrados = [];
let paginaActualUsuarios = 1;
const usuariosPorPagina = 5;
let books = [];


let filteredBooks = null;

// ==================== FUNCIONES DE NOTIFICACIÓN ====================
// Función para mostrar notificaciones de éxito
function showSuccessNotification(title, message) {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: 'top-end',
    background: '#f8f9fa',
    backdrop: false
  });
}

// Función para mostrar notificaciones de error
function showErrorNotification(title, message) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText: 'Entendido',
    position: 'center',
    backdrop: true
  });
}

//?----------------------------/
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
  // Reset formulario
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
  const filtroRol = document.getElementById('filter-rol-usuario').value;
  const filtroEstado = document.getElementById('filter-estado-usuario').value;
  const ordenFecha = document.getElementById('filter-fecha-usuario').value;

  // 1. Filtro base
  usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda =
      usuario.nombres.toLowerCase().includes(busqueda) ||
      usuario.apellidos.toLowerCase().includes(busqueda) ||
      usuario.numero_documento.includes(busqueda);

    const coincideRol = filtroRol === 'todos' || usuario.rol === filtroRol;
    const coincideEstado = filtroEstado === 'todos' || usuario.estado === filtroEstado;

    return coincideBusqueda && coincideRol && coincideEstado;
  });

  // 2. Orden por fecha
  usuariosFiltrados.sort((a, b) => {
    const fechaA = new Date(a.fecha_registro || '2000-01-01');
    const fechaB = new Date(b.fecha_registro || '2000-01-01');
    return ordenFecha === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
  });

  // 3. Paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const inicio = (paginaActualUsuarios - 1) * usuariosPorPagina;
  const pagina = usuariosFiltrados.slice(inicio, inicio + usuariosPorPagina);

  // 4. Render tabla
  if (pagina.length === 0) {
    contenedor.innerHTML = '<p>No hay usuarios registrados.</p>';
    document.getElementById('paginadorUsuarios').textContent = '';
    return;
  }

  pagina.forEach(usuario => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div><strong>${usuario.nombres} ${usuario.apellidos}</strong><br><small>${usuario.numero_documento}</small></div>
      <div>${usuario.correo}</div>
      <div>${usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</div>
      <div>
        <span class="estado-${usuario.estado}">${usuario.estado}</span>
      </div>
      <div class="acciones">
        <button class="edit" title="Editar" onclick="editarUsuario('${usuario.numero_documento}')">✏️</button>
        <button class="delete" title="Eliminar" onclick="eliminarUsuario('${usuario.numero_documento}')">🗑️</button>
        <button class="block" title="${usuario.estado === 'activo' ? 'Bloquear' : 'Desbloquear'}" onclick="toggleEstadoUsuario('${usuario.numero_documento}')">🚫</button>
      </div>
    `;

    contenedor.appendChild(div);
  });

  document.getElementById('paginadorUsuarios').textContent = `Página ${paginaActualUsuarios} de ${totalPaginas}`;
}

//* Base de Datos

async function renderUsuariosDesdeBackend() {
  try {
    const response = await fetch("/api/usuarios/");
    const data = await response.json();
    usuarios = data;
    renderUsuarios(); // ya tienes esta función implementada
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

//* Funciones de Interacción

function filtrarUsuarios() {
  const doc = document.getElementById('filtroDocumento').value.trim();
  const rol = document.getElementById('filtroRol').value;

  let filtrados = usuarios;

  if (doc !== '') {
    filtrados = filtrados.filter(u => u.numero_documento.includes(doc));
  }

  if (rol !== 'todos') {
    filtrados = filtrados.filter(u => u.rol === rol);
  }

  renderUsuarios(filtrados);
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
    rol: document.getElementById("rol").value,
    estado: "activo"
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
    showErrorNotification('Error', 'Ocurrió un error al guardar el usuario. ' + error.message);
    console.error(error);
  }

  
}

function editarUsuario(doc) {
  const usuario = usuarios.find(u => u.numero_documento === doc);
  if (!usuario) return;

  // Activar pestaña de formulario
  mostrarSeccionUsuarios('agregar');

  // Rellenar campos
  document.getElementById('modo-edicion').value = "true";
  document.getElementById('usuario-editando-doc').value = doc;

  document.getElementById('numDoc').value = usuario.numero_documento;
  document.querySelector('select[name="tipo_documento"]').value = usuario.tipo_documento;
  document.getElementById('nombres').value = usuario.nombres;
  document.getElementById('apellidos').value = usuario.apellidos;
  document.getElementById('fecha').value = usuario.fecha;
  document.getElementById('genero').value = usuario.genero;
  document.getElementById('direccion').value = usuario.direccion;
  document.getElementById('ciudad').value = usuario.ciudad;
  document.getElementById('telefono').value = usuario.telefono;
  document.getElementById('correo').value = usuario.correo;
  document.getElementById('rol').value = usuario.rol;
  document.getElementById('contraseña').value = usuario.contraseña;

  // Bloquear número de documento si es necesario
  document.getElementById('numDoc').readOnly = true;
}

function eliminarUsuario(doc) {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    usuarios = usuarios.filter(u => u.numero_documento !== doc);
    renderUsuarios();
  }
}

function toggleEstadoUsuario(doc) {
  const usuario = usuarios.find(u => u.numero_documento === doc);
  if (usuario) {
    usuario.estado = usuario.estado === 'activo' ? 'bloqueado' : 'activo';
    renderUsuarios();
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

//* Filtrar usuarios

// Implementar un throttling para las peticiones
const requestQueue = [];
let isProcessing = false;

async function processQueue() {
    if (isProcessing || requestQueue.length === 0) return;
    
    isProcessing = true;
    const request = requestQueue.shift();
    
    try {
        const response = await fetch(request.url, request.options);
        request.resolve(response);
    } catch (error) {
        request.reject(error);
    } finally {
        isProcessing = false;
        setTimeout(processQueue, 100); // Procesar siguiente solicitud después de 100ms
    }
}

function throttledFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        requestQueue.push({ url, options, resolve, reject });
        processQueue();
    });
}

async function fetchWithRetry(url, options = {}, retries = 3) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Response not OK');
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

// Simple sistema de caché
const apiCache = new Map();

async function cachedFetch(url) {
    if (apiCache.has(url)) {
        return apiCache.get(url);
    }
    
    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    // Guardar en caché por 30 segundos
    apiCache.set(url, data);
    setTimeout(() => apiCache.delete(url), 30000);
    
    return data;
}

//?----------------------------/
//?----- GESTIONAR LIBROS -----/
//?----------------------------/

//* Funciones Inicializadoras

function mostrarSeccionLibros(seccion) {
  // Ocultar todas las secciones de libros y autores
  document.querySelectorAll('#seccion-listar-libros, #seccion-agregar-libro, #seccion-editar-libro, #seccion-listar-autores, #seccion-agregar-autor').forEach(div => {
    div.classList.add('hidden-section');
  });

  // Resetear todas las pestañas
  document.querySelectorAll('#gestion-libros .user-tab').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar la pestaña de edición solo cuando sea necesario
  if (seccion === 'editar') {
    document.getElementById('tabEditarLibro').style.display = 'block';
    document.getElementById('tabEditarLibro').classList.add('active');
    document.getElementById('seccion-editar-libro').classList.remove('hidden-section');
    return;
  } else {
    document.getElementById('tabEditarLibro').style.display = 'none';
  }

  // Activar la pestaña correspondiente y mostrar la sección
  switch (seccion) {
    case 'listar':
      document.querySelector('#gestion-libros .user-tab:nth-child(1)').classList.add('active');
      document.getElementById('seccion-listar-libros').classList.remove('hidden-section');
      renderBooksAdmin();
      break;

    case 'agregar':
      document.querySelector('#gestion-libros .user-tab:nth-child(2)').classList.add('active');
      document.getElementById('seccion-agregar-libro').classList.remove('hidden-section');
      document.getElementById('formLibro').reset();
      document.getElementById("previewPortada").style.display = "none";
      document.getElementById('mensajeLibro').style.display = 'none';
      document.getElementById('mensajeErrorLibro').style.display = 'none';
      break;

    case 'listar_autores':
      document.querySelector('#gestion-libros .user-tab:nth-child(4)').classList.add('active');
      document.getElementById('seccion-listar-autores').classList.remove('hidden-section');
      listarAutores();
      break;

    case 'agregar_autor':
      document.querySelector('#gestion-libros .user-tab:nth-child(5)').classList.add('active');
      document.getElementById('seccion-agregar-autor').classList.remove('hidden-section');
      document.getElementById('formAutor').reset();
      document.getElementById('mensajeAutor').style.display = 'none';
      document.getElementById('mensajeErrorAutor').style.display = 'none';
      
      const form = document.getElementById("formAutor");
      form.dataset.editando = "false";
      form.dataset.idAutor = "";
      form.querySelector('button[type="submit"]').textContent = "Registrar autor";
      break;
  }
}

function mostrarFormularioLibro() {
  const formSection = document.getElementById('formularioLibro');
  formSection.classList.toggle('hidden-section');
}

async function renderBooksAdmin() {
  try {
    const response = await fetch('/api/libros');
    
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }

    books = await response.json(); // Guardamos los libros globalmente

    const bookList = document.getElementById('adminBookList');
    bookList.innerHTML = '';
    
    // Obtener valores de los filtros
    const search = document.getElementById('search-admin').value.toLowerCase();
    const category = document.getElementById('filter-category-admin').value;
    const minRating = parseFloat(document.getElementById('filter-rating-admin').value);
    const order = document.getElementById('filter-order-admin').value;

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
               onclick="showAdminBookDetails('${book.ISBN}')"
               style="cursor:pointer; width: 120px; height: auto; display: block; margin: 0 auto;">
        `;

        bookList.appendChild(div);
      });
    }

    document.getElementById('pageIndicator').innerText =
      `Página ${currentPage} de ${Math.max(1, totalPages)}`;
  } catch (error) {
    console.error('Error al cargar libros:', error);
    document.getElementById('adminBookList').innerHTML =
      '<p class="error">Error al cargar los libros. Intente nuevamente.</p>';
  }
}

async function showAdminBookDetails(isbn) {
  try {
    const response = await fetch(`/api/libros/${isbn}`);
    if (!response.ok) {
      throw new Error('Libro no encontrado');
    }
    const book = await response.json();
    
    const autores = Array.isArray(book.autores) ? 
                  book.autores.map(a => a.nombre).join(', ') : 'Autor desconocido';

    // Mostrar detalles en el panel
    document.getElementById('detailCover').src = book.portada || 'https://via.placeholder.com/150';
    document.getElementById('detailTitle').textContent = book.titulo;
    document.getElementById('detailAuthor').textContent = autores;
    document.getElementById('detailStatus').textContent = 'Disponible'; // Puedes agregar este campo a tu modelo
    document.getElementById('detailRating').textContent = book.promedio_calificacion ? 
      '⭐'.repeat(Math.round(book.promedio_calificacion)) + ` (${book.promedio_calificacion.toFixed(1)})` : 'Sin calificaciones';
    document.getElementById('detailDescription').textContent = book.descripcion_libro || 'No hay descripción disponible.';
    
    // Botones de administración
    document.getElementById('detailButton').innerHTML = `
      <div class="admin-buttons">
        <button onclick="editarLibro('${book.ISBN}')">Editar</button>
        <button onclick="eliminarLibro('${book.ISBN}')" class="delete-btn">Eliminar</button>
      </div>
    `;
    
    //-->#Se modificó
    const panel = document.getElementById('bookDetailPanel');
    panel.classList.add('active');
    panel.classList.remove('hidden-section');
    
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    showErrorNotification('Error', 'No se pudieron cargar los detalles del libro: ' + error.message);
  }
}

//* Funciones de Interacción

// Configurar eventos de los filtros para admin
function setupAdminFilterEvents() {
// Evento para mostrar/ocultar menú de filtros
  const filterToggle = document.getElementById('filterToggleBtn-admin');
  const filtersMenu = document.getElementById('filtersMenu-admin');
  
  // Mostrar/Ocultar el menú de filtros
  if (filterToggle && filtersMenu) {
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el clic se propague -Evita que se cierre por clics internos
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
  document.getElementById('applyFiltersBtn-admin').addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1;
    renderBooksAdmin();
    document.getElementById('filtersMenu-admin').classList.add('hidden');
  });
  
  // Evento de búsqueda
  document.getElementById('search-admin').addEventListener('input', () => {
    currentPage = 1;
    renderBooksAdmin();
  });

  // Eventos para cambios en los select de filtros
  document.getElementById('filter-category-admin').addEventListener('change', () => {
    currentPage = 1;
    renderBooksAdmin();
  });
  
  document.getElementById('filter-rating-admin').addEventListener('change', () => {
    currentPage = 1;
    renderBooksAdmin();
  });
  
  document.getElementById('filter-order-admin').addEventListener('change', () => {
    currentPage = 1;
    renderBooksAdmin();
  });
}

// Configurar eventos de los filtros para usuarios
function setupUserFilterEvents() {
  const filterToggle = document.getElementById('filterToggleBtn-usuarios');
  const filtersMenu = document.getElementById('filtersMenu-usuarios');
  
  if (filterToggle && filtersMenu) {
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      filtersMenu.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
      if (!filtersMenu.contains(e.target) && e.target !== filterToggle) {
        filtersMenu.classList.add('hidden');
      }
    });
  }

  // Botón "Aplicar filtros"
  document.getElementById('aplicarFiltrosUsuarios').addEventListener('click', (e) => {
    e.preventDefault();
    paginaActualUsuarios = 1;
    renderUsuarios();
    document.getElementById('filtersMenu-usuarios').classList.add('hidden');
  });

  // Listeners directos en los select para aplicar los filtros automáticamente
  ['filter-rol-usuario', 'filter-estado-usuario', 'filter-fecha-usuario'].forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('change', () => {
        paginaActualUsuarios = 1;
        renderUsuarios();
      });
    }
  });

}

function closeDetailPanel() {
  const panel = document.getElementById('bookDetailPanel');
  panel.classList.remove('active');
  panel.classList.add('hidden-section');
}

async function registrarLibro(event) {
  event.preventDefault();

  const nuevoLibro = {
    titulo: document.getElementById('tituloLibro').value.trim(),
    autores: [document.getElementById('autorLibro').value.trim()],
    editorial: document.getElementById('editorialLibro').value.trim(),
    year: parseInt(document.getElementById('anioLibro').value),
    ISBN: document.getElementById('isbnLibro').value.trim(),
    genero: document.getElementById('generoLibro').value.trim(),
    portada: document.getElementById('urlPortadaLibro').value.trim(),
    descripcion_libro: document.getElementById('descripcionLibro').value.trim() 
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
    renderBooksAdmin();

    //document.getElementById('formularioLibro').classList.add('hidden-section');
    
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

function closeDetailPanel() {
  const panel = document.getElementById('bookDetailPanel');
  if (panel.classList.contains('active')) {
    panel.classList.remove('active');
    // Limpiar el contenido para que no quede visible al volver
    document.getElementById('detailCover').src = '';
    document.getElementById('detailTitle').textContent = '';
    document.getElementById('detailAuthor').textContent = '';
    document.getElementById('detailDescription').textContent = '';
  }
}

async function editarLibro(isbn) {
  try {
    // 1. Cerrar el panel de detalles si está abierto
    closeDetailPanel();
    
    // 2. Mostrar la pestaña de edición
    document.getElementById('tabEditarLibro').style.display = 'block';
    
    // 3. Obtener datos del libro
    const response = await fetch(`/api/libros/${isbn}`);
    if (!response.ok) throw new Error('Libro no encontrado');
    const book = await response.json();
    
    // 4. Mostrar la sección de edición
    mostrarSeccionLibros('editar');
    
    // 5. Rellenar el formulario con los datos del libro
    document.getElementById('edit-tituloLibro').value = book.titulo;
    document.getElementById('edit-autorLibro').value = book.autores.map(a => a.nombre).join(', ');
    document.getElementById('edit-editorialLibro').value = book.editorial;
    document.getElementById('edit-anioLibro').value = book.año_publicacion || '';
    document.getElementById('edit-isbnLibro').value = book.ISBN;
    document.getElementById('edit-isbnLibroVisible').value = book.ISBN;
    document.getElementById('edit-generoLibro').value = book.genero;
    document.getElementById('edit-urlPortadaLibro').value = book.portada || '';
    document.getElementById('edit-descripcionLibro').value = book.descripcion_libro || '';
    document.getElementById('edit-estadoLibro').value = 'disponible'; // Ajustar según necesidad
    
    // 6. Actualizar vista previa de la portada
    const preview = document.getElementById("edit-previewPortada");
    if (book.portada) {
      preview.src = book.portada;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
    
    // 7. Configurar evento para vista previa en tiempo real
    document.getElementById("edit-urlPortadaLibro").addEventListener("input", function() {
      const url = this.value;
      if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        preview.src = url;
        preview.style.display = "block";
      } else {
        preview.src = "";
        preview.style.display = "none";
      }
    });
    
    // 8. Hacer scroll suave al formulario
    document.getElementById('formularioEditarLibro').scrollIntoView({
      behavior: 'smooth'
    });
    
  } catch (error) {
    console.error('Error al editar libro:', error);
    document.getElementById('mensajeErrorEdicionLibro').textContent = `❌ ${error.message}`;
    document.getElementById('mensajeErrorEdicionLibro').style.display = 'block';
    setTimeout(() => {
      document.getElementById('mensajeErrorEdicionLibro').style.display = 'none';
    }, 3000);
  }
}

async function actualizarLibro(event) {
  event.preventDefault();
  
  // Ocultar mensajes anteriores
  document.getElementById('mensajeEdicionLibro').style.display = 'none';
  document.getElementById('mensajeErrorEdicionLibro').style.display = 'none';
  
  const isbn = document.getElementById('edit-isbnLibro').value;
  
  const libroActualizado = {
    titulo: document.getElementById('edit-tituloLibro').value.trim(),
    autores: [document.getElementById('edit-autorLibro').value.trim()],
    editorial: document.getElementById('edit-editorialLibro').value.trim(),
    year: parseInt(document.getElementById('edit-anioLibro').value) || null,
    genero: document.getElementById('edit-generoLibro').value.trim(),
    portada: document.getElementById('edit-urlPortadaLibro').value.trim(),
    descripcion_libro: document.getElementById('edit-descripcionLibro').value.trim()
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
    document.getElementById('mensajeEdicionLibro').textContent = "✅ Libro actualizado correctamente";
    document.getElementById('mensajeEdicionLibro').style.display = 'block';
    
    // Actualizar la lista de libros
    await renderBooksAdmin();
    
    // Ocultar pestaña de edición
    document.getElementById('tabEditarLibro').style.display = 'none';
    
    // Volver a la lista después de 2 segundos
    setTimeout(() => {
      document.getElementById('mensajeEdicionLibro').style.display = 'none';
      mostrarSeccionLibros('listar');
    }, 2000);
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('mensajeErrorEdicionLibro').textContent = `❌ ${error.message}`;
    document.getElementById('mensajeErrorEdicionLibro').style.display = 'block';
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
    renderBooksAdmin();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error:', error);
    showErrorNotification('Error', 'Error al eliminar el libro: ' + error.message);
  }
}

//* Funciones de paginación

function nextPageAdmin() {
    currentPage++;
    renderBooksAdmin();
}

function prevPageAdmin() {
  if (currentPage > 1) {
    currentPage--;
    renderBooksAdmin();
  }
}

//?----------------------------/
//?---- GESTIONAR AUTORES -----/
//?----------------------------/

async function listarAutores() {
  try {
    const response = await fetch("/api/libros/autores");
    const autores = await response.json();

    const contenedor = document.getElementById("listaAutores");
    contenedor.innerHTML = "";

    if (!autores.length) {
      contenedor.innerHTML = "<p>No hay autores registrados.</p>";
      return;
    }

    autores.forEach(autor => {
      const div = document.createElement("div");
      div.className = "row";

      const libros = autor.libros?.length
        ? autor.libros.map(titulo => `<div>${titulo}</div>`).join("")
        : "<div>N/A</div>";


      div.innerHTML = `
        <div>${autor.nombre}</div>
        <div>${autor.nacionalidad || "No especificada"}</div>
        <div>${autor.biografia || "Sin biografía"}</div>
        <div>${libros}</div>
        <div class="acciones">
          <button class="edit" title="Editar" onclick="editarAutor('${autor.id_autor}')">
            <i class='bx bx-edit'></i>
          </button>
          <button class="delete" title="Eliminar" onclick="eliminarAutor('${autor.id_autor}')">
            <i class='bx bx-trash'></i>
          </button>
        </div>
      `;

      contenedor.appendChild(div);
    });
  } catch (err) {
    document.getElementById("listaAutores").innerHTML = "<p>Error al cargar autores.</p>";
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


function eliminarAutor(id) {
  if (confirm("¿Estás seguro de eliminar este autor?")) {
    fetch(`/api/libros/autores/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta:", data);
      showErrorNotification(data.error, data.mensaje);
      listarAutores(); // refrescar autores
    })
    .catch(err => {
      console.error("Error al eliminar autor:", err);
      showErrorNotification('Error', 'Error al eliminar autor: ' + error.message);
    });
  }
}

function nextPageAdmin() {
  const totalPages = Math.ceil(books.length / booksPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBooksAdmin();
  }
}

function prevPageAdmin() {
  if (currentPage > 1) {
    currentPage--;
    renderBooksAdmin();
  }
}

//?----------------------------/
//?---- GESTIONAR INFORMES ----/
//?----------------------------/

//?----------------------------/
//?----- GESTIONAR PERFIL -----/
//?----------------------------/

//* Funciones Inicializadoras

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

//* Funciones de Interacción

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


document.getElementById('aplicarFiltrosUsuarios').addEventListener('click', () => {
  paginaActualUsuarios = 1;
  renderUsuarios();
  document.getElementById('filtersMenu-usuarios').classList.add('hidden');
});


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

document.getElementById('search-admin').addEventListener('input', () => {
  currentPage = 1;
  renderBooksAdmin();
});

// Activar búsqueda de usuarios en tiempo real
document.getElementById('search-usuarios').addEventListener('input', () => {
  paginaActualUsuarios = 1;
  renderUsuarios();
});

// Vista previa de portada en tiempo real
document.getElementById("urlPortadaLibro").addEventListener("input", () => {
  const url = document.getElementById("urlPortadaLibro").value;
  const preview = document.getElementById("previewPortada");

  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
});

// Password strength checker - Mover este código al final del archivo
function setupPasswordStrengthChecker() {
  const passwordInput = document.getElementById('password');
  const showHide = document.querySelector('.show_hide');
  const indicator = document.querySelector('.password-indicator');
  const iconText = document.querySelector('.icon-text');
  const indicatorText = document.querySelector('.indicator-text');

  if (!passwordInput || !showHide || !indicator) return;

  // Mostrar/ocultar contraseña
  showHide.addEventListener('click', () => {
    if(passwordInput.type === 'password'){
      passwordInput.type = 'text';
      showHide.classList.replace('bx-hide', 'bx-show');
    } else {
      passwordInput.type = 'password';
      showHide.classList.replace('bx-show', 'bx-hide');
    }
  });

  // Verificador de fortaleza
  let alphabet = /[a-zA-Z]/, // letras a-z y A-Z
      numbers = /[0-9]/,     // números 0-9
      scharacters = /[!,@,#,$,%,^,&,*,?,_,(,),-,+,=,~]/; // caracteres especiales

  passwordInput.addEventListener('input', () => {
    indicator.classList.add('active');
    
    let val = passwordInput.value;
    indicator.className = 'password-indicator active'; // Reset classes
    
    if(val.match(alphabet) || val.match(numbers) || val.match(scharacters)){
      indicatorText.textContent = "Contraseña débil";
      indicator.classList.add('password-weak');
      showHide.style.color = "#FF6333";
      if (iconText) iconText.style.color = "#FF6333";
    }
    
    if(val.match(alphabet) && val.match(numbers) && val.length >= 6){
      indicatorText.textContent = "Contraseña media";
      indicator.classList.add('password-medium');
      showHide.style.color = "#cc8500";
      if (iconText) iconText.style.color = "#cc8500";
    }
    
    if(val.match(alphabet) && val.match(numbers) && val.match(scharacters) && val.length >= 8){
      indicatorText.textContent = "Contraseña fuerte";
      indicator.classList.add('password-strong');
      showHide.style.color = "#22C32A";
      if (iconText) iconText.style.color = "#22C32A";
    }
    
    if(val === ""){
      indicator.classList.remove('active');
      showHide.style.color = "#A6A6A6";
      if (iconText) iconText.style.color = "#A6A6A6";
    }
  });
}

// Cierre automático del panel de detalles al hacer clic fuera
document.addEventListener('click', (e) => {
  const panel = document.getElementById('bookDetailPanel');
  const isActive = panel.classList.contains('active');

  // Si está visible y el clic fue fuera del panel, lo cerramos
  if (isActive && !panel.contains(e.target)) {
    panel.classList.remove('active');
  }
});

// Configurar eventos para las pestañas de libros
document.querySelectorAll('#gestion-libros .user-tab').forEach(btn => {
  btn.addEventListener('click', function() {
    const target = this.getAttribute('onclick').match(/mostrarSeccionLibros\('([^']+)'/)[1];
    mostrarSeccionLibros(target);
  });
});

// Formatea fecha ISO "YYYY-MM-DD" a formato legible en español
function formatDate(s) {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
}

// Función para cerrar el panel de detalles
function closeDetails() {
  const container = document.getElementById('loan-details-container');
  if (container) {
    container.style.display = 'none';
  }
}

// Renderiza lista de préstamos/devoluciones (actualizada)
function renderLoanList(items, containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`renderLoanList: no existe contenedor #${containerId}`);
    return;
  }
  
  container.innerHTML = '';
  
  if (!Array.isArray(items) || items.length === 0) {
    let texto = '';
    if (type === 'active') texto = 'No hay préstamos activos';
    else if (type === 'overdue') texto = 'No hay préstamos vencidos';
    else if (type === 'returns') texto = 'No hay devoluciones recientes';
    else texto = 'No hay datos';
    
    container.innerHTML = `
      <div class="no-loans">
        <i class="fas fa-book-open"></i>
        <p>${texto}</p>
      </div>
    `;
    return;
  }
  
  items.forEach(item => {
    const libro = item.libro || {};
    const usuario = item.usuario || {};
    const titulo = libro.titulo || 'Sin título';
    const portada = libro.portada || 'https://via.placeholder.com/60x90/EDE0D4/9C6644?text=Libro';
    const nombreUsuario = `${usuario.nombre || usuario.nombres || ''} ${usuario.apellido || usuario.apellidos || ''}`.trim() || 'Usuario';
    const fechaPrestamo = item.fecha_prestamo || '';
    let fechaInfo = '';
    
    if (type === 'returns') {
      fechaInfo = item.fecha_devolucion || '';
    } else {
      fechaInfo = item.fecha_vencimiento || '';
    }
    
    const div = document.createElement('div');
    div.className = 'loan-item';
    div.innerHTML = `
      <img src="${portada}" alt="${titulo}" class="loan-book-cover" />
      <div class="loan-item-details">
        <h5>${titulo}</h5>
        <p><i class="fas fa-calendar-alt"></i> Prestado: ${formatDate(fechaPrestamo)}</p>
        ${type === 'returns' 
          ? `<p><i class="fas fa-undo"></i> Devuelto: ${formatDate(fechaInfo)}</p>`
          : `<p><i class="fas fa-clock"></i> Vence: ${formatDate(fechaInfo)}</p>`}
        <p><i class="fas fa-user"></i> Usuario: ${nombreUsuario}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

// Hace fetch al endpoint y llama a renderLoanList
async function fetchAndRenderLoans(endpoint, containerId, type) {
  try {
    console.log(`fetchAndRenderLoans: cargando ${endpoint}`);
    const resp = await fetch(endpoint);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    console.log(`fetchAndRenderLoans: datos recibidos de ${endpoint}:`, data);
    renderLoanList(data, containerId, type);
  } catch (e) {
    console.error(`Error en fetchAndRenderLoans (${endpoint}):`, e);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error al cargar datos</p>
          <button onclick="showLoanDetails('${type}')" class="btn-retry">Reintentar</button>
        </div>
      `;
    }
  }
}

async function fetchAndRenderReservas(endpoint, containerId) {
  try {
    const resp = await fetch(endpoint);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (!data.reservas || data.reservas.length === 0) {
      container.innerHTML = `
        <div class="no-loans">
          <i class="fas fa-calendar-times"></i>
          <p>No hay reservas pendientes</p>
        </div>
      `;
      return;
    }

    data.reservas.forEach(reserva => {
      const libro = reserva.libro || {};
      const portada = libro.portada || 'https://via.placeholder.com/60x90/EDE0D4/9C6644?text=Libro';
      const usuario = reserva.usuario || 'Usuario';
      const fecha = reserva.fecha || reserva.fecha_reserva || '';

      const div = document.createElement('div');
      div.className = 'loan-item';
      div.innerHTML = `
        <img src="${portada}" alt="${libro.titulo}" class="loan-book-cover" />
        <div class="loan-item-details">
          <h5>${libro.titulo || 'Libro'}</h5>
          <p><i class="fas fa-calendar-day"></i> Reservado: ${formatDate(fecha)}</p>
          <p><i class="fas fa-user"></i> Usuario: ${usuario}</p>
        </div>
      `;
      container.appendChild(div);
    });

  } catch (e) {
    console.error(`Error en fetchAndRenderReservas (${endpoint}):`, e);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error al cargar reservas</p>
        </div>
      `;
    }
  }
}


// Muestra detalles según tipo: active, overdue, returns
async function showLoanDetails(type) {
  const container = document.getElementById('loan-details-container');
  const contentId = 'loan-details-content';
  const titleEl = document.getElementById('details-title');
  
  if (!container || !titleEl) {
    console.warn("showLoanDetails: contenedor o título no encontrado");
    return;
  }

  container.style.display = 'block';

  const titles = {
    'active': 'Préstamos Activos',
    'returns': 'Devoluciones Recientes',
    'reservas': 'Reservas Pendientes'
  };

  const endpoints = {
    'active': '/api/informes/prestamos-activos',
    'returns': '/api/informes/devoluciones-recientes',
    'reservas': '/api/informes/reservas-pendientes'
  };

  titleEl.textContent = titles[type] || 'Detalles';
  const endpoint = endpoints[type];

  const contentEl = document.getElementById(contentId);
  if (!endpoint || !contentEl) {
    if (contentEl) contentEl.innerHTML = '<p>Tipo inválido</p>';
    return;
  }

  contentEl.innerHTML = `
    <div class="loading-message">
      <div class="loading-spinner"></div>
      <p>Cargando detalles...</p>
    </div>
  `;

  if (type === 'reservas') {
    await fetchAndRenderReservas(endpoint, contentId);
  } else {
    await fetchAndRenderLoans(endpoint, contentId, type);
  }
}


// Carga conteos de préstamos
async function loadLoanReports() {
  console.log("loadLoanReports: iniciando");
  try {
    const elActive   = document.getElementById('active-loans');
    const elReturns  = document.getElementById('total-returns');
    const elReservas = document.getElementById('total-reservas');

    if (elActive)   elActive.textContent = '...';
    if (elReturns)  elReturns.textContent = '...';
    if (elReservas) elReservas.textContent = '...';

    const resp = await fetch('/api/informes/prestamos-usuario');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    console.log("loadLoanReports: datos:", data);

    if (elActive)   elActive.textContent = data.prestamos_activos ?? '0';
    if (elReturns)  elReturns.textContent = data.prestamos_devueltos ?? '0';
    if (elReservas) elReservas.textContent = data.reservas ?? '0';
  } catch (e) {
    console.error("loadLoanReports error:", e);
    ['active-loans','total-returns','total-reservas'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = 'Err';
    });
  }
}


// Asociar listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cargar reportes cuando se haga clic en el menú de Informes
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-target');
      if (target === 'informes') {
        loadLoanReports();
        loadReservasCount(); // También carga reservas
        loadCharts(); // Carga gráficas
      }
    });
  });

  // Manejar clic en las estadísticas (incluye reservas correctamente)
  document.querySelectorAll('.stat-box[data-loan-type]').forEach(box => {
    box.addEventListener('click', function () {
      const tipo = this.getAttribute('data-loan-type');
      showLoanDetails(tipo); // ✅ ahora maneja también "reservas"
    });
  });


  // Manejar clic en el botón de cerrar
  const closeBtn = document.querySelector('.close-details');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDetails);
  }
});

// Función para cargar todas las gráficas
async function loadCharts() {
  try {
    const baseUrl = 'http://127.0.0.1:5000';

    // 1. Libros más prestados
    const booksResponse = await fetch(`${baseUrl}/api/informes/libros-populares?limite=5`);
    const booksData = await booksResponse.json();
    renderBooksChart(booksData);

    // 2. Usuarios con más préstamos
    const topUsersResponse = await fetch(`${baseUrl}/api/informes/usuarios-mas-prestamos?limite=5`);
    const topUsersData = await topUsersResponse.json();
    renderTopUsersChart(topUsersData);

    // 3. Géneros más prestados
    const genresResponse = await fetch(`${baseUrl}/api/informes/generos-populares?limite=5`);
    const genresData = await genresResponse.json();
    renderGenresChart(genresData);

  } catch (error) {
    console.error("Error cargando gráficas:", error);
    showErrorMessages();
  }
}

// Función para renderizar gráfica de libros más prestados
function renderBooksChart(data) {
  const ctx = document.getElementById('mostBorrowedBooksChart');
  if (!ctx) return;

  if (window.booksChart) window.booksChart.destroy();

  if (!data || data.length === 0) {
    ctx.parentElement.innerHTML = '<p class="no-data">No hay datos de libros populares</p>';
    return;
  }

  const labels = data.map(item => item.titulo || 'Sin título');
  const chartData = data.map(item => item.total_prestamos || 0);

  const colors = ['#FF6384', '#36A2EB', '#4BC0C0', '#FFCD56', '#9966FF']; // Rosa, azul, turquesa, amarillo, morado

  window.booksChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Préstamos',
        data: chartData,
        backgroundColor: colors.slice(0, data.length),
        borderColor: '#333',
        borderWidth: 1
      }]
    },
    options: getBarChartOptions('Préstamos')
  });
}


// Función para renderizar gráfica de usuarios con más préstamos
function renderTopUsersChart(data) {
  const ctx = document.getElementById('topRatedBooksChart'); // Usamos el mismo canvas
  if (!ctx) return;

  if (window.topRatedChart) window.topRatedChart.destroy();

  if (!data || data.length === 0) {
    ctx.parentElement.innerHTML = '<p class="no-data">No hay datos de usuarios</p>';
    return;
  }

  const labels = data.map(item => item.nombre_completo || 'Usuario');
  const chartData = data.map(item => item.total_prestamos || 0);

  const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7']; // Rosado, melón, durazno, verde claro, agua

  window.topRatedChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Préstamos',
        data: chartData,
        backgroundColor: colors.slice(0, data.length),
        borderColor: '#444',
        borderWidth: 1
      }]
    },
    options: getBarChartOptions('Préstamos')
  });
}

// Función para renderizar gráfica de géneros más prestados
function renderGenresChart(data) {
  const ctx = document.getElementById('popularGenresChart');
  if (!ctx) return;

  if (window.genresChart) window.genresChart.destroy();

  if (!data || data.length === 0) {
    ctx.parentElement.innerHTML = '<p class="no-data">No hay datos de géneros</p>';
    return;
  }

  const labels = data.map(item => item.genero || 'Sin género');
  const chartData = data.map(item => item.total_prestamos || 0);

  const backgroundColors = [
    '#F67280', // rosa fuerte
    '#C06C84', // rosado oscuro
    '#6C5B7B', // púrpura
    '#355C7D', // azul profundo
    '#99B898'  // verde seco
  ];

  window.genresChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: chartData,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw} préstamos`;
            }
          }
        }
      }
    }
  });
}


// Opciones comunes para gráficas de barras
function getBarChartOptions(yLabel) {
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw} ${yLabel.toLowerCase()}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: yLabel
        }
      }
    }
  };
}

// Función para mostrar mensajes de error
function showErrorMessages() {
  const containers = [
    'mostBorrowedBooksChart',
    'topRatedBooksChart',
    'popularGenresChart'
  ];
  
  containers.forEach(id => {
    const element = document.getElementById(id);
    if (element && element.parentElement) {
      element.parentElement.innerHTML = '<p class="error">Error al cargar datos</p>';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderUsuarios();
  setupAdminFilterEvents();
  setupUserFilterEvents(); 
  renderBooksAdmin();
  mostrarSeccionLibros('listar'); 
  loadCharts();
  
  // También necesitamos inicializar los eventos para los usuarios
  renderUsuariosDesdeBackend();

  // Mostrar la pestaña de edición solo cuando sea necesario
  document.getElementById('tabEditarLibro').classList.add('hidden');
});

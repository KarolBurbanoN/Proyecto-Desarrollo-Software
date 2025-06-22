let currentPage = 1;
const booksPerPage = 10;
let usuarios = [];
let usuariosFiltrados = [];
let paginaActualUsuarios = 1;
const usuariosPorPagina = 5;

let filteredBooks = null;

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
    // Reset formulario si no estamos en modo edición
    const modoEdicion = document.getElementById('modo-edicion');
    const submitBtn = document.querySelector('#formUsuario button[type="submit"]');
    
    if (modoEdicion.value !== "true") {
      document.getElementById('modo-edicion').value = "false";
      document.getElementById('usuario-editando-doc').value = "";
      document.getElementById('numDoc').readOnly = false;
      document.querySelector('.form').reset();
      
      // Cambiar texto del botón a "Registrar"
      if (submitBtn) {
        submitBtn.textContent = "Registrar Usuario";
        submitBtn.classList.remove('update-btn');
      }
    } else {
      // Cambiar texto del botón a "Actualizar"
      if (submitBtn) {
        submitBtn.textContent = "Actualizar Usuario";
        submitBtn.classList.add('update-btn');
      }
    }
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
      (usuario.nombres?.toLowerCase().includes(busqueda) || 
       usuario.apellidos?.toLowerCase().includes(busqueda) || 
       usuario.numero_documento?.includes(busqueda) || 
       usuario.correo?.toLowerCase().includes(busqueda)) || 
      busqueda === '';

    // Verificar filtro por rol
    const coincideRol = 
      filtroRol === 'todos' || 
      usuario.rol?.toLowerCase() === filtroRol.toLowerCase();

    // Verificar filtro por estado (corregido)
    const coincideEstado = 
      filtroEstado === 'todos' || 
      (filtroEstado === 'activo' && usuario.estado?.toLowerCase() === 'activa') ||
      (filtroEstado === 'bloqueado' && usuario.estado?.toLowerCase() === 'bloqueada');

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

  // 4. Crear tabla
  const tabla = document.createElement('div');
  tabla.className = 'usuarios-table';

  // Crear encabezado
  const header = document.createElement('div');
  header.className = 'row header';
  header.innerHTML = `
    <div>Nombre</div>
    <div>Correo</div>
    <div>Tipo de Usuario</div>
    <div>Estado</div>
    <div>Acciones</div>
  `;
  tabla.appendChild(header);

  // 5. Render tabla
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
    usuarios = data;
    renderUsuarios(); // ya tienes esta función implementada
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
    alert(error.message || "Ocurrió un error al eliminar el usuario.");
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
    rol: document.getElementById("rol").value,
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
    alert(error.message || "Ocurrió un error al guardar el usuario.");
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
    if (!usuario) return;

    // Determinar el nuevo estado (alternar entre 'activa' y 'bloqueada')
    const nuevoEstado = usuario.estado === 'activa' ? 'bloqueada' : 'activa';
    
    // Mostrar confirmación al usuario
    const confirmacion = confirm(`¿Estás seguro de querer ${nuevoEstado === 'bloqueada' ? 'bloquear' : 'desbloquear'} a ${usuario.nombres} ${usuario.apellidos}?`);
    if (!confirmacion) return;

    // Enviar la solicitud al servidor
    const response = await fetch(`/api/usuarios/${doc}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al cambiar estado");
    }

    // Actualizar el estado localmente
    usuario.estado = nuevoEstado;
    
    // Volver a renderizar la lista de usuarios
    renderUsuarios();

    // Mostrar mensaje de éxito
    const mensaje = document.getElementById("mensajeRegistro");
    mensaje.textContent = `✅ Usuario ${nuevoEstado === 'bloqueada' ? 'bloqueado' : 'desbloqueado'} correctamente`;
    mensaje.style.display = "block";

    // Ocultar el mensaje después de 2 segundos
    setTimeout(() => {
      mensaje.style.display = "none";
    }, 2000);

  } catch (error) {
    console.error("Error al cambiar estado:", error);
    alert(error.message || "Ocurrió un error al cambiar el estado del usuario.");
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
    const booksFromDB = await response.json();

    const bookList = document.getElementById('BibliotecarioBookList');
    bookList.innerHTML = '';

    // Obtener valores de los filtros
    const search = document.getElementById('search-Bibliotecario').value.toLowerCase();
    const category = document.getElementById('filter-category-Bibliotecario').value;
    const minRating = parseFloat(document.getElementById('filter-rating-Bibliotecario').value) || 0;
    const order = document.getElementById('filter-order-Bibliotecario').value;

    // Aplicar filtros
    let filtered = booksFromDB.filter(book => {
      const title = book.titulo?.toLowerCase() || '';
      const authors = Array.isArray(book.autores) ? 
        book.autores.map(a => a.nombre?.toLowerCase()).join(' ') : '';
      const genero = book.genero || '';
      const rating = book.promedio_calificacion || 0;

      const matchesSearch = search === '' || 
        title.includes(search) || 
        authors.includes(search);
      const matchesCategory = category === 'all' || genero === category;
      const matchesRating = rating >= minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });

    // Aplicar orden
    if (order === 'recent') {
      filtered.sort((a, b) => new Date(b.fecha_agregado || b.año_publicacion || '2000-01-01') -
        new Date(a.fecha_agregado || a.año_publicacion || '2000-01-01'));
    } else if (order === 'oldest') {
      filtered.sort((a, b) => new Date(a.fecha_agregado || a.año_publicacion || '2000-01-01') -
        new Date(b.fecha_agregado || b.año_publicacion || '2000-01-01'));
    } else if (order === 'rating') {
      filtered.sort((a, b) => (b.promedio_calificacion || 0) - (a.promedio_calificacion || 0));
    }

    // Paginación
    const totalPages = Math.ceil(filtered.length / booksPerPage);
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
    if (!response.ok) {
      throw new Error('Libro no encontrado');
    }
    const book = await response.json();

    const autores = Array.isArray(book.autores) ?
      book.autores.map(a => a.nombre).join(', ') : 'Autor desconocido';

    // Mostrar detalles en el panel
    document.getElementById('detailCover').src = book.portada || 'https://via.placeholder.com/150';
    document.getElementById('detailTitle').textContent = book.titulo;
    document.getElementById('detailAuthor').textContent = book.autores.map(a => a.nombre).join(', ');
    document.getElementById('detailStatus').textContent = 'Disponible'; // Puedes agregar este campo a tu modelo
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

    document.getElementById('bookDetailPanel').classList.add('active');

  } catch (error) {
    console.error('Error al cargar detalles:', error);
    alert('No se pudieron cargar los detalles del libro');
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

  // 1. Verificar que los elementos existen
  if (!filterToggle || !filtersMenu) {
    console.error('Elementos de filtro de usuarios no encontrados');
    return;
  }

  // 2. Evento para mostrar/ocultar menú de filtros
  filterToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    filtersMenu.classList.toggle('hidden');
  });

  // 3. Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!filtersMenu.contains(e.target) && e.target !== filterToggle) {
      filtersMenu.classList.add('hidden');
    }
  });

  // 4. Evento para aplicar filtros
  const aplicarFiltrosBtn = document.getElementById('aplicarFiltrosUsuarios');
  if (aplicarFiltrosBtn) {
    aplicarFiltrosBtn.addEventListener('click', (e) => {
      e.preventDefault();
      paginaActualUsuarios = 1;
      renderUsuarios(); // Usamos la función principal de renderizado
      filtersMenu.classList.add('hidden');
    });
  }

  // 5. Eventos para cambios en tiempo real (opcional)
  const searchInput = document.getElementById('search-usuarios');
  const rolFilter = document.getElementById('filter-rol-usuario');
  const estadoFilter = document.getElementById('filter-estado-usuario');
  const fechaFilter = document.getElementById('filter-fecha-usuario');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      paginaActualUsuarios = 1;
      renderUsuarios();
    });
  }

  if (rolFilter) {
    rolFilter.addEventListener('change', () => {
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

  if (fechaFilter) {
    fechaFilter.addEventListener('change', () => {
      paginaActualUsuarios = 1;
      renderUsuarios();
    });
  }
}

function closeDetailPanel() {
  document.getElementById('bookDetailPanel').classList.remove('active');
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
    // Obtener datos actuales del libro
    const response = await fetch(`/api/libros/${isbn}`);
    const book = await response.json();

    // Mostrar formulario de edición con los datos
    mostrarFormularioLibro();

    // Rellenar formulario con datos existentes
    document.getElementById('tituloLibro').value = book.titulo;
    document.getElementById('autorLibro').value = book.autores.map(a => a.nombre).join(', ');
    document.getElementById('editorialLibro').value = book.editorial;
    document.getElementById('anioLibro').value = book.año_publicacion || '';
    document.getElementById('isbnLibro').value = book.ISBN;
    document.getElementById('generoLibro').value = book.genero;
    document.getElementById('urlPortadaLibro').value = book.portada || '';

    // Actualizar vista previa de portada
    const preview = document.getElementById("previewPortada");
    if (book.portada) {
      preview.src = book.portada;
      preview.style.display = "block";
    }

    // Cambiar el comportamiento del formulario para edición
    const form = document.getElementById('formLibro');
    form.onsubmit = async function (e) {
      e.preventDefault();
      await actualizarLibro(isbn);
    };

  } catch (error) {
    console.error('Error al editar libro:', error);
    alert('No se pudo cargar el libro para edición');
  }
}

async function actualizarLibro(isbn) {
  const libroActualizado = {
    titulo: document.getElementById('tituloLibro').value.trim(),
    autores: [document.getElementById('autorLibro').value.trim()],
    editorial: document.getElementById('editorialLibro').value.trim(),
    year: parseInt(document.getElementById('anioLibro').value) || null,
    genero: document.getElementById('generoLibro').value.trim(),
    portada: document.getElementById('urlPortadaLibro').value.trim()
  };

  try {
    const response = await fetch(`/api/libros/${isbn}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libroActualizado)
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el libro');
    }

    alert('Libro actualizado correctamente');
    renderBooksBibliotecario();
    document.getElementById('formularioLibro').classList.add('hidden-section');

  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar el libro: ' + error.message);
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

    alert('Libro eliminado correctamente');
    renderBooksBibliotecario();
    closeDetailPanel();

  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar el libro: ' + error.message);
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
    alert("No se pudo cargar el autor.");
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
      alert(data.mensaje || data.error);
      listarAutores(); // refrescar autores
    })
    .catch(err => {
      console.error("Error al eliminar autor:", err);
      alert("Error al eliminar autor");
    });
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
    alert('Perfil actualizado correctamente');

    // Volver a la vista de resumen
    cancelarEdicionPerfil();

  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar el perfil: ' + error.message);
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

window.addEventListener('DOMContentLoaded', () => {
  renderUsuariosDesdeBackend();
  setupUserFilterEvents(); // <-- Esta línea es crucial
  setupBibliotecarioFilterEvents(); // <-- No olvides esta
  renderBooksBibliotecario();
  listarAutores();
});
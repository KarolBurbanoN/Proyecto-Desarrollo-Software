let currentPage = 1;
const booksPerPage = 10;
let usuarios = [];
let usuariosFiltrados = [];
let paginaActualUsuarios = 1;
const usuariosPorPagina = 5;

const books = [
  // Romance
  {
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    available: true,
    rating: 4.8,
    category: 'Romance',
    addedDate: '2022-12-01',
    reviews: ["Una obra maestra."],
    cover: 'https://covers.openlibrary.org/b/id/9886522-M.jpg'
  },
  {
    title: 'El amor en los tiempos del cólera',
    author: 'Gabriel García Márquez',
    available: false,
    rating: 4.5,
    category: 'Romance',
    addedDate: '2021-08-15',
    reviews: ["Historia de amor a través del tiempo."],
    cover: 'https://covers.openlibrary.org/b/id/14839677-M.jpg'
  },
  {
    title: 'Orgullo y prejuicio',
    author: 'Jane Austen',
    available: true,
    rating: 4.7,
    category: 'Romance',
    addedDate: '2023-01-10',
    reviews: ["Clásico romántico imperdible."],
    cover: 'https://covers.openlibrary.org/b/id/7712438-M.jpg'
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    available: true,
    rating: 4.6,
    category: 'Romance',
    addedDate: '2023-02-25',
    reviews: ["Una historia profunda y emotiva."],
    cover: 'https://covers.openlibrary.org/b/id/13900709-M.jpg'
  },
  {
    title: 'Bajo la misma estrella',
    author: 'John Green',
    available: true,
    rating: 4.4,
    category: 'Romance',
    addedDate: '2023-03-18',
    reviews: ["Una historia moderna y conmovedora."],
    cover: 'https://covers.openlibrary.org/b/id/12333346-M.jpg'
  },

  // Terror
  {
    title: 'La ciudad y los perros',
    author: 'Mario Vargas Llosa',
    available: true,
    rating: 4.3,
    category: 'Terror',
    addedDate: '2023-02-10',
    reviews: ["Retrato crítico de la sociedad."],
    cover: 'https://covers.openlibrary.org/b/id/13952189-M.jpg'
  },
  {
    title: 'It',
    author: 'Stephen King',
    available: true,
    rating: 4.7,
    category: 'Terror',
    addedDate: '2023-04-01',
    reviews: ["Terror psicológico magistral."],
    cover: 'https://covers.openlibrary.org/b/id/14655624-M.jpg'
  },
  {
    title: 'El resplandor',
    author: 'Stephen King',
    available: false,
    rating: 4.6,
    category: 'Terror',
    addedDate: '2023-01-15',
    reviews: ["Suspenso y horror inolvidable."],
    cover: 'https://covers.openlibrary.org/b/id/14655766-M.jpg'
  },
  {
    title: 'Drácula',
    author: 'Bram Stoker',
    available: true,
    rating: 4.5,
    category: 'Terror',
    addedDate: '2022-11-20',
    reviews: ["Clásico del horror gótico."],
    cover: 'https://covers.openlibrary.org/b/id/10114404-M.jpg'
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    available: true,
    rating: 4.4,
    category: 'Terror',
    addedDate: '2023-03-10',
    reviews: ["Inmortal historia de la ciencia y horror."],
    cover: 'https://covers.openlibrary.org/b/id/10756700-M.jpg'
  },

  // Ciencia Ficción
  {
    title: 'Ficciones',
    author: 'Jorge Luis Borges',
    available: false,
    rating: 4.9,
    category: 'Ciencia Ficción',
    addedDate: '2023-07-20',
    reviews: ["Obra maestra filosófica."],
    cover: 'https://covers.openlibrary.org/b/id/7888787-L.jpg'
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    available: true,
    rating: 4.8,
    category: 'Ciencia Ficción',
    addedDate: '2023-04-05',
    reviews: ["Clásico de la ciencia ficción épica."],
    cover: 'https://covers.openlibrary.org/b/id/8231850-L.jpg'
  },
  {
    title: 'Neuromante',
    author: 'William Gibson',
    available: true,
    rating: 4.5,
    category: 'Ciencia Ficción',
    addedDate: '2023-06-10',
    reviews: ["Pionero del cyberpunk."],
    cover: 'https://covers.openlibrary.org/b/id/8231874-L.jpg'
  },
  {
    title: 'El fin de la eternidad',
    author: 'Isaac Asimov',
    available: true,
    rating: 4.6,
    category: 'Ciencia Ficción',
    addedDate: '2023-05-12',
    reviews: ["Un viaje en el tiempo fascinante."],
    cover: 'https://covers.openlibrary.org/b/id/8231877-L.jpg'
  },
  {
    title: 'La guerra de los mundos',
    author: 'H. G. Wells',
    available: false,
    rating: 4.3,
    category: 'Ciencia Ficción',
    addedDate: '2023-02-22',
    reviews: ["Invasión extraterrestre clásica."],
    cover: 'https://covers.openlibrary.org/b/id/8231899-L.jpg'
  },

  // Fantasía
  {
    title: 'Rayuela',
    author: 'Julio Cortázar',
    available: true,
    rating: 4.7,
    category: 'Fantasía',
    addedDate: '2023-05-05',
    reviews: ["Innovador y desafiante."],
    cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg'
  },
  {
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    available: true,
    rating: 4.8,
    category: 'Fantasía',
    addedDate: '2023-01-20',
    reviews: ["Clásico de la fantasía épica."],
    cover: 'https://covers.openlibrary.org/b/id/8231880-L.jpg'
  },
  {
    title: 'Harry Potter y la piedra filosofal',
    author: 'J.K. Rowling',
    available: true,
    rating: 4.7,
    category: 'Fantasía',
    addedDate: '2023-06-15',
    reviews: ["Mágico y envolvente."],
    cover: 'https://covers.openlibrary.org/b/id/14925450-M.jpg'
  },
  {
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    available: false,
    rating: 4.6,
    category: 'Fantasía',
    addedDate: '2023-04-20',
    reviews: ["Narrativa excepcional."],
    cover: 'https://covers.openlibrary.org/b/id/8231896-L.jpg'
  },
  {
    title: 'La princesa prometida',
    author: 'William Goldman',
    available: true,
    rating: 4.5,
    category: 'Fantasía',
    addedDate: '2023-03-11',
    reviews: ["Aventura y romance clásico."],
    cover: 'https://covers.openlibrary.org/b/id/8231901-L.jpg'
  },

  // Comics
  {
    title: 'Watchmen',
    author: 'Alan Moore',
    available: true,
    rating: 4.9,
    category: 'Comics',
    addedDate: '2023-07-01',
    reviews: ["Revolucionario y oscuro."],
    cover: 'https://covers.openlibrary.org/b/id/8030406-M.jpg'
  },
  {
    title: 'Maus',
    author: 'Art Spiegelman',
    available: true,
    rating: 4.8,
    category: 'Comics',
    addedDate: '2023-05-15',
    reviews: ["Profundo y conmovedor."],
    cover: 'https://covers.openlibrary.org/b/id/14383494-M.jpg'
  },
  {
    title: 'Sandman',
    author: 'Neil Gaiman',
    available: true,
    rating: 4.7,
    category: 'Comics',
    addedDate: '2023-04-01',
    reviews: ["Místico y literario."],
    cover: 'https://covers.openlibrary.org/b/id/11222507-M.jpg'
  },
  {
    title: 'Batman: El regreso del Caballero Oscuro',
    author: 'Frank Miller',
    available: true,
    rating: 4.6,
    category: 'Comics',
    addedDate: '2023-03-18',
    reviews: ["Oscuro y épico."],
    cover: 'https://covers.openlibrary.org/b/id/14636539-M.jpg'
  },
  {
    title: 'Persepolis',
    author: 'Marjane Satrapi',
    available: false,
    rating: 4.5,
    category: 'Comics',
    addedDate: '2023-02-10',
    reviews: ["Biografía gráfica emotiva."],
    cover: 'https://covers.openlibrary.org/b/id/12909206-M.jpg'
  }
];

let filteredBooks = null;

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
    alert(error.message || "Ocurrió un error al guardar el usuario.");
    console.error(error);
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

async function renderBooksAdmin() {
  try {
    const response = await fetch('/api/libros');
    
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }
    const booksFromDB = await response.json();

    const bookList = document.getElementById('adminBookList');
    bookList.innerHTML = '';
    
     // Obtener valores de los filtros
    const search = document.getElementById('search-admin').value.toLowerCase();
    const category = document.getElementById('filter-category-admin').value;
    const minRating = parseFloat(document.getElementById('filter-rating-admin').value);
    const order = document.getElementById('filter-order-admin').value;


    // Aplicar filtros
    let filtered = booksFromDB.filter(book => {
      const title = book.titulo?.toLowerCase() || '';
      const authors = Array.isArray(book.autores) ? book.autores.map(a => a.nombre.toLowerCase()).join(' ') : '';
      const genero = book.genero || '';
      const rating = book.promedio_calificacion || 0;

      const matchesSearch = title.includes(search) || authors.includes(search);
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
    
    console.log("Libros obtenidos del backend:", booksFromDB); //---> validr la estructura de los libros

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



// Configurar eventos de los filtros para admin
function setupAdminFilterEvents() {
// Evento para mostrar/ocultar menú de filtros
  const filterToggle = document.getElementById('filterToggleBtn-admin');
  const filtersMenu = document.getElementById('filtersMenu-admin');
  
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
  
  document.getElementById('aplicarFiltrosUsuarios').addEventListener('click', (e) => {
    e.preventDefault();
    paginaActualUsuarios = 1;
    renderUsuarios();
    document.getElementById('filtersMenu-usuarios').classList.add('hidden');
  });
}

// Nueva función específica para el panel de administrador
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
    document.getElementById('detailAuthor').textContent = book.autores.map(a => a.nombre).join(', ');
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
    
    document.getElementById('bookDetailPanel').classList.add('active');
    
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    alert('No se pudieron cargar los detalles del libro');
  }
}

function closeDetailPanel() {
  document.getElementById('bookDetailPanel').classList.remove('active');
}

function mostrarSeccionLibros(seccion) {
  document.querySelectorAll('#gestion-libros .user-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#seccion-listar-libros, #seccion-agregar-libro').forEach(div => div.classList.add('hidden-section'));

  if (seccion === 'listar') {
    document.querySelector('#gestion-libros .user-tab:nth-child(1)').classList.add('active');
    document.getElementById('seccion-listar-libros').classList.remove('hidden-section');
    // Asegurarnos de configurar los eventos cuando se muestra la sección
    setTimeout(setupAdminFilterEvents, 0);


  } else {
    document.querySelector('#gestion-libros .user-tab:nth-child(2)').classList.add('active');
    document.getElementById('seccion-agregar-libro').classList.remove('hidden-section');
  }

  // Reinicia el formulario si es agregar
  if (seccion === 'agregar') {
    document.getElementById('formLibro').reset();
    document.getElementById("previewPortada").src = "";
    document.getElementById("previewPortada").style.display = "none";
    document.getElementById('mensajeLibro').style.display = 'none';
    document.getElementById('mensajeErrorLibro').style.display = 'none'
  }
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
    form.onsubmit = async function(e) {
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
    renderBooksAdmin();
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
    renderBooksAdmin();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar el libro: ' + error.message);
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

function mostrarFormularioLibro() {
  const formSection = document.getElementById('formularioLibro');
  formSection.classList.toggle('hidden-section');
}

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

function logout() {
  alert('Sesión cerrada.');
  // Puedes usar location.reload() si quieres refrescar la página
}

//* Filtros desplegables para admin
document.getElementById('filterToggleBtn-admin').addEventListener('click', () => {
  const menu = document.getElementById('filtersMenu-admin');
  menu.classList.toggle('hidden');
});

//* Filtros desplegables para usuarios

document.getElementById('filterToggleBtn-usuarios').addEventListener('click', () => {
  document.getElementById('filtersMenu-usuarios').classList.toggle('hidden');
});

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

// Al final del archivo, modificar el DOMContentLoaded para incluir el setup
window.addEventListener('DOMContentLoaded', () => {
  renderUsuarios();
  setupAdminFilterEvents();
  setupUserFilterEvents(); 
  renderBooksAdmin();
  renderUsuariosDesdeBackend();
  setupPasswordStrengthChecker(); // Añadir esta línea
});

window.addEventListener('DOMContentLoaded', () => {
  renderUsuarios();
  setupAdminFilterEvents();
  setupUserFilterEvents(); 
  renderBooksAdmin();
  
  // También necesitamos inicializar los eventos para los usuarios
  renderUsuariosDesdeBackend();
});


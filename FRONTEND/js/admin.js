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
  
    renderUsuariosDesdeBackend();
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
  console.log("🔁 renderUsuarios recibidos:", usuariosFiltrados.length, "filtrados de", usuarios.length);
  const contenedor = document.getElementById('listaUsuarios');
  contenedor.innerHTML = '';

  const filtroBuscarElement = document.getElementById('filtroBuscar');
  const filtroRolElement = document.getElementById('filter-rol-usuario');
  const filtroEstadoElement = document.getElementById('filter-estado-usuario');
  const filtroFechaElement = document.getElementById('filter-fecha-usuario');
  
  const busqueda = filtroBuscarElement ? filtroBuscarElement.value.toLowerCase() : '';
  const filtroRol = filtroRolElement ? filtroRolElement.value : 'todos';
  const filtroEstado = filtroEstadoElement ? filtroEstadoElement.value : 'todos';
  const ordenFecha = filtroFechaElement ? filtroFechaElement.value : 'reciente';
  
  
  // 1. Filtro base
  usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda =
      usuario.nombres.toLowerCase().includes(busqueda) ||
      usuario.apellidos.toLowerCase().includes(busqueda) ||
      usuario.numero_documento.includes(busqueda);

    const coincideRol = filtroRol === 'todos' || usuario.rol === filtroRol;
    const coincideEstado = filtroEstado === 'todos' || usuario.estado_cuenta === filtroEstado;

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
      <div><strong>${usuario.nombres}</strong></div>
      <div>${usuario.correo}</div>
      <div>${usuario.telefono}</div>
      <div><span class="estado-${usuario.estado_cuenta}">${usuario.estado_cuenta}</span></div>
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
  console.log("👉 renderUsuariosDesdeBackend se está ejecutando"); debugger;
  try {
    const response = await fetch("/api/usuarios/");
    console.log("💾 Response fetch:", response);
    const data = await response.json();
    console.log("📋 Data recibida:", data);
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

function renderBooksAdmin() {
  const bookList = document.getElementById('adminBookList');
  const search = document.getElementById('search-admin').value.toLowerCase();
  const category = document.getElementById('filter-category-admin').value;

  const booksToUse = filteredBooks || books;

  let filtered = booksToUse.filter(book =>
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search)
  );

  if (category !== 'all') {
    filtered = filtered.filter(book => book.category === category);
  }

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginated = filtered.slice(start, end);

  bookList.innerHTML = '';
  paginated.forEach((book) => {
    const index = books.indexOf(book);

    const div = document.createElement('div');
    div.className = 'book';

    div.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" onclick="showAdminBookDetails(${index})" style="cursor:pointer;">
    `;

    bookList.appendChild(div);
  });

  document.getElementById('pageIndicator').innerText =
    `Página ${currentPage} de ${Math.max(1, Math.ceil(filtered.length / booksPerPage))}`;
}

// Nueva función específica para el panel de administrador
function showAdminBookDetails(index) {
  const book = books[index];
  document.getElementById('detailCover').src = book.cover;
  document.getElementById('detailTitle').textContent = book.title;
  document.getElementById('detailAuthor').textContent = book.author;
  document.getElementById('detailStatus').textContent = book.available ? 'Disponible' : 'No disponible';
  document.getElementById('detailRating').textContent = '⭐'.repeat(Math.round(book.rating)) + ` (${book.rating.toFixed(1)})`;
  document.getElementById('detailReviews').innerHTML = book.reviews.map(r => `<li>${r}</li>`).join('');
  
  // Botones para administrador
  document.getElementById('detailButton').innerHTML = `
    <div class="admin-buttons">
      <button onclick="editarLibro(${index})">Editar</button>
      <button onclick="eliminarLibro(${index})" class="delete-btn">Eliminar</button>
    </div>
  `;

  document.getElementById('bookDetailPanel').classList.add('active');
}

function closeDetailPanel() {
  document.getElementById('bookDetailPanel').classList.remove('active');
}

function editarLibro(index) {
  const book = books[index];
  // Aquí implementarías la lógica para editar el libro
  console.log("Editando libro:", book.title);
  alert(`Editando libro: ${book.title}`);
  // Podrías abrir un formulario de edición aquí
}

function eliminarLibro(index) {
  const book = books[index];
  if (confirm(`¿Estás seguro de querer eliminar "${book.title}"?`)) {
    books.splice(index, 1);
    renderBooksAdmin();
    closeDetailPanel();
    alert(`Libro "${book.title}" eliminado correctamente`);
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

function registrarLibro(event) {
  event.preventDefault();

  const nuevoLibro = {
    title: document.getElementById('tituloLibro').value.trim(),
    author: document.getElementById('autorLibro').value.trim(),
    editorial: document.getElementById('editorialLibro').value.trim(),
    year: parseInt(document.getElementById('anioLibro').value),
    isbn: document.getElementById('isbnLibro').value.trim(),
    category: document.getElementById('categoriaLibro').value.trim(),
    genre: document.getElementById('generoLibro').value.trim(),
    available: document.getElementById('estadoLibro').value === 'disponible',
    rating: 0,
    addedDate: new Date().toISOString().split('T')[0],
    reviews: [],
    cover: 'https://covers.openlibrary.org/b/id/10909258-M.jpg' // Imagen por defecto
  };

  books.push(nuevoLibro);
  renderBooksAdmin();

  document.getElementById('formLibro').reset();
  document.getElementById('formularioLibro').classList.add('hidden-section');
  document.getElementById('mensajeLibro').style.display = 'block';

  setTimeout(() => {
    document.getElementById('mensajeLibro').style.display = 'none';
  }, 3000);
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

document.getElementById('applyFiltersBtn-admin').addEventListener('click', () => {
  const category = document.getElementById('filter-category-admin').value;
  const minRating = parseFloat(document.getElementById('filter-rating-admin').value);
  const order = document.getElementById('filter-order-admin').value;

  filteredBooks = books.filter(book => book.rating >= minRating);

  if(category !== 'all') {
    filteredBooks = filteredBooks.filter(book => book.category === category);
  }

  if(order === 'recent') {
    filteredBooks.sort((a,b) => new Date(b.addedDate) - new Date(a.addedDate));
  } else if(order === 'oldest') {
    filteredBooks.sort((a,b) => new Date(a.addedDate) - new Date(b.addedDate));
  } else if(order === 'rating') {
    filteredBooks.sort((a,b) => b.rating - a.rating);
  }

  currentPage = 1;
  renderBooksAdmin();
  document.getElementById('filtersMenu-admin').classList.add('hidden');
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

// Inicializar dashboard
renderUsuarios();
renderBooksAdmin();
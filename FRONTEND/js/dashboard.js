let currentPage = 1;
const booksPerPage = 10;
let currentUser = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'lector'
};

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

const prestamos = [
  {
    title: 'Cien años de soledad',
    due: '2025-05-20',
    index: books.findIndex(b => b.title === 'Cien años de soledad'),
    userReview: null,
    userRating: null
  },
  {
    title: 'La ciudad y los perros',
    due: '2025-05-25',
    index: books.findIndex(b => b.title === 'La ciudad y los perros'),
    userReview: null,
    userRating: null
  }
];

const reservas = {}; // { 'Título del libro': [lista de usuarios] }

currentUser.name = 'Juan Pérez';
currentUser.email = 'juan@example.com';
currentUser.role = 'lector';


let filteredBooks = null;

async function renderBooks() {
  try {
    const response = await fetch('/api/libros');
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }
    const booksFromDB = await response.json();
    
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    
    // Aplicar filtros
    const search = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('filter-category').value;
    
    let filtered = booksFromDB.filter(book => {
      const matchesSearch = 
        book.titulo.toLowerCase().includes(search) ||
        book.autores.ssme(a => a.nombre.toLowerCase().includes(search));
      const matchesCategory = category === 'all' || book.genero === category;
      return matchesSearch && matchesCategory;
    });
    
    // Paginación
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginated = filtered.slice(start, end);
    
    // Renderizar libros
    paginated.forEach(book => {
      const div = document.createElement('div');
      div.className = 'book';
      
      div.innerHTML = `
        <img src="${book.portada || 'https://via.placeholder.com/150'}" 
             alt="${book.titulo}" 
             onclick="showBookDetails('${book.ISBN}')" 
             style="cursor:pointer;">
      `;
      
      bookList.appendChild(div);
    });
    
    document.getElementById('pageIndicator').innerText =
      `Página ${currentPage} de ${Math.max(1, Math.ceil(filtered.length / booksPerPage))}`;
      
  } catch (error) {
    console.error('Error al cargar libros:', error);
    document.getElementById('bookList').innerHTML = 
      '<p class="error">Error al cargar los libros. Intente nuevamente.</p>';
  }
}

async function showBookDetails(isbn) {
  try {
    const response = await fetch(`/api/libros/${isbn}`);
    if (!response.ok) {
      throw new Error('Libro no encontrado');
    }
    const book = await response.json();
    
    // Obtener disponibilidad (necesitarías implementar esta función)
    const disponible = await verificarDisponibilidad(isbn);
    
    // Mostrar detalles
    document.getElementById('detailCover').src = book.portada || 'https://via.placeholder.com/150';
    document.getElementById('detailTitle').textContent = book.titulo;
    document.getElementById('detailAuthor').textContent = book.autores.map(a => a.nombre).join(', ');
    document.getElementById('detailStatus').textContent = disponible ? 'Disponible' : 'No disponible';
    document.getElementById('detailRating').textContent = book.promedio_calificacion ? 
      '⭐'.repeat(Math.round(book.promedio_calificacion)) + ` (${book.promedio_calificacion.toFixed(1)})` : 'Sin calificaciones';
    document.getElementById('detailDescription').textContent = book.descripcion_libro || 'No hay descripción disponible.';

    // Botones de acción
    if (disponible) {
      document.getElementById('detailButton').innerHTML = `
        <button onclick="prestarLibro('${book.ISBN}')">Prestar</button>
      `;
    } else {
      document.getElementById('detailButton').innerHTML = `
        <button onclick="reservarLibro('${book.ISBN}')">Reservar</button>
      `;
    }
    
    document.getElementById('bookDetailPanel').classList.add('active');
    
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    alert('No se pudieron cargar los detalles del libro');
  }
}

function closeDetailPanel() {
  document.getElementById('bookDetailPanel').classList.remove('active');
}

// Función para verificar disponibilidad (necesitas implementar el endpoint correspondiente)
async function verificarDisponibilidad(isbn) {
  try {
    const response = await fetch(`/api/libros/${isbn}/disponibilidad`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.disponible;
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    return false;
  }
}

// Función para prestar libro
async function prestarLibro(isbn) {
  try {
    const response = await fetch('/api/prestamos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ISBN: isbn,
        usuario_id: currentUser.id // Necesitas tener esta información
      })
    });
    
    if (!response.ok) {
      throw new Error('No se pudo realizar el préstamo');
    }
    
    alert('Libro prestado correctamente');
    renderBooks();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error al prestar libro:', error);
    alert('Error al prestar libro: ' + error.message);
  }
}

// Función para reservar libro
async function reservarLibro(isbn) {
  try {
    const response = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ISBN: isbn,
        usuario_id: currentUser.id // Necesitas tener esta información
      })
    });
    
    if (!response.ok) {
      throw new Error('No se pudo realizar la reserva');
    }
    
    alert('Libro reservado correctamente. Te notificaremos cuando esté disponible.');
    renderBooks();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error al reservar libro:', error);
    alert('Error al reservar libro: ' + error.message);
  }
}

function submitReview(e, index, fromPrestamos = false) {
  e.preventDefault();
  const reviewInput = e.target.querySelector('input');
  const ratingInput = e.target.querySelector('select');
  const review = reviewInput.value;
  const rating = parseInt(ratingInput.value);

  books[index].reviews.push(review);
  books[index].rating = ((books[index].rating * (books[index].reviews.length - 1)) + rating) / books[index].reviews.length;

  // Guardar reseña en préstamo
  const p = prestamos.find(p => p.index === index);
  if (p) {
    p.userReview = review;
    p.userRating = rating;
  }

  if (fromPrestamos) {
    renderPrestamos();
  } else {
    renderBooks();
  }
}

function nextPage() {
  const totalPages = Math.ceil(books.length / booksPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBooks();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
  }
}

function renderPrestamos() {
  const prestamosList = document.getElementById('prestamosList');
  prestamosList.innerHTML = '';

  prestamos.forEach((p) => {
    const book = books[p.index];

    const li = document.createElement('li');

    // Mostrar formulario si no hay reseña, mostrar solo la reseña si ya existe
    let contenidoResena = '';
    if (p.userReview && p.userRating) {
      contenidoResena = `
        <p><strong>Tu calificación:</strong> ${'⭐'.repeat(p.userRating)} (${p.userRating})</p>
        <p><strong>Tu reseña:</strong> ${p.userReview}</p>
        <button onclick="devolverLibro(${p.index})">Devolver libro</button>
      `;
    } else {
      contenidoResena = `
        <form onsubmit="submitReview(event, ${p.index}, true)">
          <input type="text" placeholder="Escribe una reseña..." required>
          <select>
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </select>
          <button type="submit">Enviar Reseña</button>
        </form>
      `;
    }

    li.innerHTML = `
      <div class="card book-prestamo-card">
        <div class="book-prestamo-cover">
          <img src="${book.cover}" alt="${book.title}" />
        </div>
        <div class="book-prestamo-info">
          <h3>${p.title}</h3>
          <p><strong>Autor:</strong> ${book.author}</p>
          <p><strong>Devolver antes del:</strong> ${p.due}</p>
          ${contenidoResena}
        </div>
      </div>
    `;

    prestamosList.appendChild(li);
  });
}

function devolverLibro(index) {
  const book = books[index];
  const title = book.title;

  // Marcar como disponible
  book.available = true;

  // Eliminar préstamo
  const prestamoIndex = prestamos.findIndex(p => p.index === index);
  if (prestamoIndex !== -1) {
    prestamos.splice(prestamoIndex, 1);
  }

  // Ver si hay reservas
  if (reservas[title] && reservas[title].length > 0) {
    const siguienteUsuario = reservas[title][0];
    alert(`¡${siguienteUsuario}, el libro "${title}" ya está disponible para ti!`);

    // Si el usuario actual es el primero en la fila
    if (siguienteUsuario === currentUser.name) {
      book.available = false;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      prestamos.push({
        title: book.title,
        due: dueDate.toISOString().split('T')[0],
        index,
        userReview: null,
        userRating: null
      });

      reservas[title].shift(); // quita al usuario de la cola
    }
  }

  renderBooks();
  renderPrestamos();
  renderReservas();

  alert('¡Gracias por devolver el libro! 😊');
}

function renderReservas() {
  const reservasList = document.getElementById('reservasList');
  reservasList.innerHTML = '';

  Object.entries(reservas).forEach(([title, usuarios]) => {
    if (usuarios.includes(currentUser.name)) {
      const li = document.createElement('li');
      li.textContent = `${title} - En espera (${usuarios.indexOf(currentUser.name) + 1}º en la fila)`;
      reservasList.appendChild(li);
    }
  });
}

function reservarLibro(index) {
  const book = books[index];
  const title = book.title;

  if (!reservas[title]) {
    reservas[title] = [];
  }

  // Evitar reservas duplicadas
  if (!reservas[title].includes(currentUser.name)) {
    reservas[title].push(currentUser.name);
    alert(`Has reservado "${title}". Se te notificará cuando esté disponible.`);
  } else {
    alert(`Ya has reservado "${title}".`);
  }

  renderReservas();
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

// Filtros desplegables
document.getElementById('filterToggleBtn').addEventListener('click', () => {
  const menu = document.getElementById('filtersMenu');
  menu.classList.toggle('hidden');
});

document.getElementById('applyFiltersBtn').addEventListener('click', () => {
  const selectedCategories = Array.from(document.querySelectorAll('.filter-category:checked')).map(cb => cb.value);
  const selectedAuthors = Array.from(document.querySelectorAll('.filter-author:checked')).map(cb => cb.value);
  const minRating = parseFloat(document.getElementById('filter-rating').value);
  const order = document.getElementById('filter-order').value;

  filteredBooks = books.filter(book => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category);
    const matchAuthor = selectedAuthors.length === 0 || selectedAuthors.includes(book.author);
    const matchRating = book.rating >= minRating;
    return matchCategory && matchAuthor && matchRating;
  });

  if(order === 'recent') {
    filteredBooks.sort((a,b) => new Date(b.addedDate) - new Date(a.addedDate));
  } else if(order === 'oldest') {
    filteredBooks.sort((a,b) => new Date(a.addedDate) - new Date(b.addedDate));
  } else if(order === 'rating') {
    filteredBooks.sort((a,b) => b.rating - a.rating);
  }

  currentPage = 1;
  renderBooks();
  document.getElementById('filtersMenu').classList.add('hidden');
});

// Navegación sidebar
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

    if (targetId) {
      const targetSection = document.getElementById(targetId);
      targetSection.classList.remove('hidden-section');
      targetSection.classList.add('active-section');
    }
  });
});

document.getElementById('search').addEventListener('input', () => {
  currentPage = 1;
  renderBooks();
});


//** Conexion Base de Datos */

// dashboard.js - Añadir estas funciones

// Función para cargar los datos del perfil desde la base de datos
async function cargarPerfilUsuario() {
    try {
        const response = await fetch('/api/usuarios/perfil', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Para manejar cookies de sesión
        });
        
        if (!response.ok) throw new Error('Error al cargar el perfil');
        
        const data = await response.json();
        
        // Actualizar la vista con los datos del usuario
        document.getElementById('resumen-nombre').textContent = data.nombres;
        document.getElementById('resumen-apellidos').textContent = data.apellidos;
        document.getElementById('resumen-email').textContent = data.correo;
        document.getElementById('resumen-direccion').textContent = data.direccion || 'No especificada';
        document.getElementById('resumen-telefono').textContent = data.telefono || 'No especificado';
        document.getElementById('resumen-ciudad').textContent = data.ciudad || 'No especificada';
        
        // Mapear género a texto completo
        const generoMap = {
            'M': 'Masculino',
            'F': 'Femenino',
            'O': 'Otro'
        };
        document.getElementById('resumen-genero').textContent = generoMap[data.genero] || 'No especificado';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del perfil');
    }
}

// Función para actualizar el perfil en la base de datos
async function actualizarPerfil(event) {
    event.preventDefault();
    
    try {
        const formData = {
            nombres: document.getElementById('edit-nombre').value,
            apellidos: document.getElementById('edit-apellidos').value,
            correo: document.getElementById('edit-email').value,
            genero: document.querySelector('input[name="genero"]:checked')?.value || 'O',
            direccion: document.getElementById('edit-address').value,
            ciudad: document.getElementById('edit-city').value,
            telefono: document.getElementById('edit-phone').value,
            contraseña: document.getElementById('edit-pass').value || undefined
        };
        
        const response = await fetch('/api/usuarios/perfil', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar el perfil');
        }
        
        const data = await response.json();
        alert(data.mensaje);
        
        // Recargar los datos del perfil
        await cargarPerfilUsuario();
        cancelarEdicionPerfil();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el perfil: ' + error.message);
    }
}

// Modificar la función editProfile existente para usar actualizarPerfil
function editProfile(event) {
    return actualizarPerfil(event);
}


// Inicializar dashboard
renderBooks();
renderPrestamos();
renderReservas();
cargarPerfilUsuario(); 

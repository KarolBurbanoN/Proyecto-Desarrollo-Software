let currentPage = 1;
const booksPerPage = 10;
let currentUser = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'lector'
};

const reservas = {}; // { 'Título del libro': [lista de usuarios] }

// Función para cargar los préstamos del usuario desde la base de datos
async function loadPrestamos() {
  try {
    const response = await fetch('/api/prestamos/usuario');
    if (!response.ok) {
      throw new Error('Error al obtener los préstamos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al cargar préstamos:', error);
    return [];
  }
}

// Función para cargar las reservas del usuario desde la base de datos
async function loadReservas() {
  try {
    const response = await fetch('/api/reservas/usuario');
    if (!response.ok) {
      throw new Error('Error al obtener las reservas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    return [];
  }
}

// Función principal para renderizar libros
async function renderBooks() {
  try {
    const response = await fetch('/api/libros');
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }
    const booksFromDB = await response.json();
    
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    
    // Obtener valores de los filtros
    const search = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('filter-category').value;
    const minRating = parseFloat(document.getElementById('filter-rating').value);
    const order = document.getElementById('filter-order').value;
    
    // Aplicar filtros
    let filtered = booksFromDB.filter(book => {
      // Filtro de búsqueda
      const matchesSearch = 
        book.titulo.toLowerCase().includes(search) ||
        book.autores.some(a => a.nombre.toLowerCase().includes(search));
      
      // Filtro de categoría
      const matchesCategory = category === 'all' || book.genero === category;
      
      // Filtro de calificación
      const matchesRating = book.promedio_calificacion >= minRating;
      
      return matchesSearch && matchesCategory && matchesRating;
    });
    
    // Aplicar orden
    if (order === 'recent') {
      filtered.sort((a, b) => new Date(b.año_publicacion || 0) - new Date(a.año_publicacion || 0));
    } else if (order === 'oldest') {
      filtered.sort((a, b) => new Date(a.año_publicacion || 0) - new Date(b.año_publicacion || 0));
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
        
        div.innerHTML = `
          <img src="${book.portada || 'https://via.placeholder.com/150'}" 
               alt="${book.titulo}" 
               onclick="showBookDetails('${book.ISBN}')" 
               style="cursor:pointer;">
          </div>
        `;
        
        bookList.appendChild(div);
      });
    }
    
    // Actualizar indicador de página
    document.getElementById('pageIndicator').innerText =
      `Página ${currentPage} de ${Math.max(1, totalPages)}`;
      
  } catch (error) {
    console.error('Error al cargar libros:', error);
    document.getElementById('bookList').innerHTML = 
      '<p class="error">Error al cargar los libros. Intente nuevamente.</p>';
  }
}

// Configurar eventos de los filtros
function setupFilterEvents() {
  // Evento para mostrar/ocultar menú de filtros
  document.getElementById('filterToggleBtn').addEventListener('click', () => {
    const menu = document.getElementById('filtersMenu');
    menu.classList.toggle('hidden');
  });
  
  // Evento para aplicar filtros
  document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    currentPage = 1; // Resetear a primera página
    renderBooks();
    document.getElementById('filtersMenu').classList.add('hidden');
  });
}

// Función para mostrar detalles del libro (actualizada)
async function showBookDetails(isbn) {
  try {
    const response = await fetch(`/api/libros/${isbn}`);
    if (!response.ok) {
      throw new Error('Libro no encontrado');
    }
    const book = await response.json();
    
    // Verificar disponibilidad
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
    return data.disponible;  // ✅ Este campo sí existe
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    return false;
  }
}

// Función para prestar libro
// Función para prestar libro (actualizada)
async function prestarLibro(isbn) {
  try {
    const response = await fetch('/api/prestamos', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ISBN: isbn })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo realizar el préstamo');
    }
    
    alert('Libro prestado correctamente');
    renderBooks();
    renderPrestamos();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error al prestar libro:', error);
    alert('Error al prestar libro: ' + error.message);
  }
}

// Función para reservar libro (actualizada)
async function reservarLibro(isbn) {
  try {
    const response = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ISBN: isbn })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo realizar la reserva');
    }
    
    alert('Libro reservado correctamente. Te notificaremos cuando esté disponible.');
    renderBooks();
    renderReservas();
    closeDetailPanel();
    
  } catch (error) {
    console.error('Error al reservar libro:', error);
    alert('Error al reservar libro: ' + error.message);
  }
}

// Función para devolver libro (actualizada)
async function devolverLibro(idPrestamo) {
  try {
    const response = await fetch(`/api/prestamos/${idPrestamo}/devolver`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo realizar la devolución');
    }
    
    alert('Libro devuelto correctamente');
    renderPrestamos();
    renderBooks();
    renderReservas(); // Asegurar que se actualicen las reservas
    
  } catch (error) {
    console.error('Error al devolver libro:', error);
    alert('Error al devolver libro: ' + error.message);
  }
}

// Función para renderizar reservas (actualizada)
async function renderReservas() {
  const reservasList = document.getElementById('reservasList');
  reservasList.innerHTML = '';

  try {
    const response = await fetch('/api/reservas/usuario');
    if (!response.ok) {
      throw new Error('Error al obtener las reservas');
    }
    const reservas = await response.json();
    
    if (reservas.length === 0) {
      reservasList.innerHTML = '<p>No tienes reservas activas</p>';
      return;
    }

    reservas.forEach(reserva => {
      // Solo mostrar reservas pendientes o notificadas
      if (reserva.estado === 'pendiente' || reserva.estado === 'notificado') {
        const li = document.createElement('li');
        li.className = 'reserva-item';
        
        const fechaReserva = new Date(reserva.fecha_reserva).toLocaleDateString();
        
        li.innerHTML = `
          <div class="card book-reserva-card">
            <div class="book-reserva-cover">
              <img src="${reserva.libro.portada || 'https://via.placeholder.com/150'}" 
                   alt="${reserva.libro.titulo}" />
            </div>
            <div class="book-reserva-info">
              <h3>${reserva.libro.titulo}</h3>
              <p><strong>Autor:</strong> ${reserva.libro.autores.map(a => a.nombre).join(', ')}</p>
              <p><strong>Fecha reserva:</strong> ${fechaReserva}</p>
              <p><strong>Estado:</strong> ${reserva.estado === 'notificado' ? 'Disponible para préstamo' : 'En espera (posición: ' + reserva.posicion + ')'}</p>
              ${reserva.estado === 'notificado' ? `
                <button onclick="convertirReservaEnPrestamo(${reserva.id_reserva}, '${reserva.libro.ISBN}')">Prestar ahora</button>
              ` : `
                <button onclick="cancelarReserva(${reserva.id_reserva})">Cancelar reserva</button>
              `}
            </div>
          </div>
        `;
        
        reservasList.appendChild(li);
      }
    });
  } catch (error) {
    console.error('Error al renderizar reservas:', error);
    reservasList.innerHTML = '<p class="error">Error al cargar las reservas</p>';
  }
}

async function convertirReservaEnPrestamo(idReserva, isbn) {
  try {
    // Primero crear el préstamo
    const prestamoResponse = await fetch('/api/prestamos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ISBN: isbn })
    });

    if (!prestamoResponse.ok) {
      const errorData = await prestamoResponse.json();
      throw new Error(errorData.error || 'No se pudo prestar el libro');
    }

    // Luego marcar la reserva como completada
    const reservaResponse = await fetch(`/api/reservas/${idReserva}/completar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!reservaResponse.ok) {
      throw new Error('No se pudo marcar la reserva como completada');
    }

    alert('Libro prestado correctamente');
    renderBooks();
    renderReservas(); // Actualizar lista de reservas
    renderPrestamos(); // Actualizar lista de préstamos
  } catch (error) {
    console.error('Error:', error);
    alert('Error al prestar libro: ' + error.message);
  }
}

// Función para cancelar reserva
async function cancelarReserva(idReserva) {
  try {
    const response = await fetch(`/api/reservas/${idReserva}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo cancelar la reserva');
    }
    
    alert('Reserva cancelada correctamente');
    renderReservas();
    
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    alert('Error al cancelar reserva: ' + error.message);
  }
}

async function submitReview(e, idPrestamo) {
  e.preventDefault();

  const reviewInput = e.target.querySelector('input');
  const ratingInput = e.target.querySelector('select');
  const review = reviewInput.value;
  const rating = parseInt(ratingInput.value);

  try {
    const response = await fetch(`/api/prestamos/${idPrestamo}/resena`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        comentario: review,
        calificacion: rating
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo guardar la reseña');
    }


    alert('Reseña enviada correctamente');
    renderPrestamos();

  } catch (error) {
    console.error('Error al enviar reseña:', error);
    alert('Error al enviar reseña: ' + error.message);
  }
}

function nextPage() {
  currentPage++;
  renderBooks();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
  }
}


// Función para renderizar préstamos (actualizada)
async function renderPrestamos() {
  const prestamosList = document.getElementById('prestamosList');
  prestamosList.innerHTML = '';
  
  try {
    const prestamos = await loadPrestamos();
    
    if (prestamos.length === 0) {
      prestamosList.innerHTML = '<p>No tienes préstamos activos</p>';
      return;
    }

    prestamos.forEach(prestamo => {
      const li = document.createElement('li');
      li.className = 'prestamo-item';
      
      // Formatear fechas
      const fechaPrestamo = new Date(prestamo.fecha_prestamo).toLocaleDateString();
      const fechaVencimiento = new Date(prestamo.fecha_vencimiento).toLocaleDateString();
      
      li.innerHTML = `
        <div class="card book-prestamo-card">
          <div class="book-prestamo-cover">
            <img src="${prestamo.libro.portada || 'https://via.placeholder.com/150'}" 
                 alt="${prestamo.libro.titulo}" />
          </div>
          <div class="book-prestamo-info">
            <h3>${prestamo.libro.titulo}</h3>
            <p><strong>Autor:</strong> ${prestamo.libro.autores.map(a => a.nombre).join(', ')}</p>
            <p><strong>Fecha préstamo:</strong> ${fechaPrestamo}</p>
            <p><strong>Devolver antes del:</strong> ${fechaVencimiento}</p>
            <p><strong>Devolver antes del:</strong> ${fechaVencimiento}</p>

            ${prestamo.puede_resenar ? `
              <form onsubmit="submitReview(event, ${prestamo.id_prestamo})">
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
            ` : `
              <button onclick="devolverLibro(${prestamo.id_prestamo})">Devolver libro</button>
            `}
          </div>
        </div>
      `;
      
      prestamosList.appendChild(li);
    });
  } catch (error) {
    console.error('Error al renderizar préstamos:', error);
    prestamosList.innerHTML = '<p class="error">Error al cargar los préstamos</p>';
  }
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


// Al inicializar el dashboard
async function initDashboard() {
  try {
    // Obtener información del usuario actual
    const userResponse = await fetch('/api/usuarios/perfil', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Error al cargar información del usuario');
    }
    
    const userData = await userResponse.json();
    currentUser = {
      id: userData.id_usuario,
      name: `${userData.nombres} ${userData.apellidos}`,
      email: userData.correo,
      role: userData.rol
    };
    
    // Renderizar todas las secciones
    setupFilterEvents();
    renderBooks();
    renderPrestamos();
    renderReservas();
    cargarPerfilUsuario();
    
  } catch (error) {
    console.error('Error al inicializar dashboard:', error);
    alert('Error al cargar datos del usuario');
  }
}

// Mostrar recomendación al usuario lector
async function mostrarRecomendacion() {
  try {
    const response = await fetch("/api/recomendacion");
    if (!response.ok) throw new Error("No se pudo obtener recomendación");
    const libro = await response.json();

    const panel = document.getElementById("recomendacionPanel");
    if (!panel) return;

    document.getElementById("recoPortada").src = libro.portada || "/static/default-book.png";
    document.getElementById("recoTitulo").textContent = libro.titulo || "Título no disponible";
    document.getElementById("recoGenero").textContent = libro.genero || "Sin género";

    panel.classList.remove("hidden-section");
  } catch (error) {
    console.warn("Error cargando recomendación:", error);
  }
}

function cerrarRecomendacion() {
  const panel = document.getElementById("recomendacionPanel");
  if (panel) panel.classList.add("hidden-section");
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilterEvents();

  setTimeout(() => {
    mostrarRecomendacion();
  }, 300); // Espera 300ms a que todo el DOM esté bien montado
});


initDashboard();

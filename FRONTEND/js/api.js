// static/js/api.js

class BibliotecaAPI {
  constructor() {
    this.baseUrl = '/api/v1';
  }

  async get(url) {
    const response = await fetch(`${this.baseUrl}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post(url, data) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Métodos específicos
  async getLibros() {
    return this.get('/libros');
  }

  async getPrestamos(usuarioId) {
    return this.get(`/prestamos/usuario/${usuarioId}`);
  }

  async getReservas(usuarioId) {
    return this.get(`/reservas/usuario/${usuarioId}`);
  }

  async getUserProfile() {
    return this.get('/usuarios/me');
  }

  async reservarLibro(ISBN) {
    return this.post('/reservas', { ISBN });
  }
}

const api = new BibliotecaAPI();
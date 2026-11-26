const API = 'http://localhost:8080/api';

// ===== CATEGORÍAS =====
export async function getCategorias() {
  const res = await fetch(`${API}/categorias`);
  return res.json();
}

export async function createCategoria(nombre) {
  const res = await fetch(`${API}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  return res.json();
}

// ===== EVENTOS =====
export async function getEventos() {
  const res = await fetch(`${API}/eventos`);
  return res.json();
}

export async function getEventosPorAsociacion(idAsociacion) {
  const res = await fetch(`${API}/eventos/asociacion/${idAsociacion}`);
  return res.json();
}

export async function getEvento(id) {
  const res = await fetch(`${API}/eventos/${id}`);
  return res.json();
}

export async function createEvento(data) {
  const res = await fetch(`${API}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateEvento(id, data) {
  const res = await fetch(`${API}/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteEvento(id) {
  const res = await fetch(`${API}/eventos/${id}`, { method: 'DELETE' });
  return res.json();
}

// ===== FAVORITOS =====
export async function getFavoritos(idVoluntario) {
  const res = await fetch(`${API}/favoritos/voluntario/${idVoluntario}`);
  return res.json();
}

export async function toggleFavorito(idVoluntario, idEvento) {
  const res = await fetch(`${API}/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idVoluntario, idEvento })
  });
  return res.json();
}

// ===== INSCRIPCIONES =====
export async function getInscripciones(idVoluntario) {
  const res = await fetch(`${API}/inscripciones/voluntario/${idVoluntario}`);
  return res.json();
}

export async function createInscripcion(data) {
  const res = await fetch(`${API}/inscripciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteInscripcion(id) {
  const res = await fetch(`${API}/inscripciones/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function updateFotoPerfil(idUsuario, base64Foto) {
  const res = await fetch(`${API}/usuarios/${idUsuario}/foto`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fotoPerfil: base64Foto })
  });
  return res.json();
}
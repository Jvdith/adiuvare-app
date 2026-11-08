const API_URL = 'http://localhost:8080/api/auth';


export async function createUser({ nombre, email, password, tipo }) {
    
    const tipoUsuario = tipo === 'asociacion' ? 'ASOCIACION' : 'VOLUNTARIO';

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre,
                correo: email,
                contrasena: password,
                tipoUsuario: tipoUsuario
            })
        });

        const data = await res.json();

        if (!res.ok) {
            
            return { error: data.error || 'Error al registrar el usuario' };
        }

       
        setCurrentUser(data.token, data.usuario);
        return { user: data.usuario };
    } catch (error) {
        return { error: 'Error de conexión con el servidor. ¿Está arrancado el backend?' };
    }
}


export async function validateLogin(email, password) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: email,
                contrasena: password
            })
        });

        const data = await res.json();

        if (!res.ok) {
           
            return { error: data.error || 'Error al iniciar sesión' };
        }

        setCurrentUser(data.token, data.usuario);
        return { user: data.usuario };
    } catch (error) {
        return { error: 'Error de conexión con el servidor. ¿Está arrancado el backend?' };
    }
}


export async function checkEmailExists(correo) {
    try {
        const res = await fetch(`${API_URL}/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo })
        });
        const data = await res.json();
        return data.existe;
    } catch (error) {
        return false;
    }
}


export function setCurrentUser(token, user) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
}

export function getCurrentUser() {
    const data = sessionStorage.getItem('user');
    return data ? JSON.parse(data) : null;
}

export function getToken() {
    return sessionStorage.getItem('token');
}

export function estaLogueado() {
  return !!sessionStorage.getItem('token');
}

export function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
}


export function updateCurrentUser(updates) {
    const current = getCurrentUser();
    if (!current) return null;

    
    const updated = {
        ...current,
        nombre: updates.nombre || current.nombre,
        correo: updates.email || current.correo,
    };

    sessionStorage.setItem('user', JSON.stringify(updated));
    return updated;
}

export function updateAvatar(base64Image) {
    const current = getCurrentUser();
    if (!current) return null;
    const updated = { ...current, fotoPerfil: base64Image };
    sessionStorage.setItem('user', JSON.stringify(updated));
    return updated;
}
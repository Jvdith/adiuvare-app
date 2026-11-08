const USERS_DB_KEY = 'adiuware_users';        
const CURRENT_USER_KEY = 'adiuware_current';  


function getUsersDB() {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
}

function saveUsersDB(users) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}


export function createUser({ nombre, email, password, tipo }) {
    const users = getUsersDB();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: 'El correo ya está registrado' };
    }

    const newUser = {
        id: Date.now(),
        nombre,
        email,
        password,
        tipo, 
    };

    saveUsersDB([...users, newUser]);
    return { user: newUser };
}


export function validateLogin(email, password, tipoEsperado) {
    const user = getUsersDB().find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) return { error: 'Usuario no existe' };
    if (user.password !== password) return { error: 'Contraseña incorrecta' };

    
    if (tipoEsperado && user.tipo !== tipoEsperado) {
        const rolReal = user.tipo === 'asociacion' ? 'Asociación' : 'Voluntario';
        return { error: `Esta cuenta es de tipo ${rolReal}` };
    }

    return { user };
}


export function setCurrentUser(user) {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
    const data = sessionStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
}


export function updateCurrentUser(updates) {
    const current = getCurrentUser();
    if (!current) return null;

    const updated = { ...current, ...updates };
    setCurrentUser(updated);

    
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        saveUsersDB(users);
    }

    return updated;
}


export function logout() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
}



export function updateAvatar(base64Image) {
    const current = getCurrentUser();
    if (!current) return null;

    const updated = { ...current, avatar: base64Image };
    setCurrentUser(updated);

   
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
        users[idx] = { ...users[idx], avatar: base64Image };
        saveUsersDB(users);
    }

    return updated;
}
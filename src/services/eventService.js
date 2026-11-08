const EVENTS_KEY = 'adiuware_events';


const INITIAL_EVENTS = [
    {
        id: 1,
        title: 'Recogida de alimentos',
        date: 'Sábado 14 Diciembre 12:00',
        loc: 'C/ Callecita Numero 8 Las Palmas',
        category: 'Comida',
        description: 'Recogida solidaria de alimentos no perecederos para familias en situación de vulnerabilidad.'
    },
    {
        id: 2,
        title: 'Paseo de perros',
        date: 'Domingo 15 Diciembre 13:00',
        loc: 'C/ Calle Street Numero 9 Las Palmas',
        category: 'Animales',
        description: 'Paseo y socialización con perros del refugio. Trae ropa cómoda y agua para los peludos.'
    },
    {
        id: 3,
        title: 'Charla Salud Mental',
        date: 'Lunes 16 Diciembre 14:00',
        loc: 'C/ Calle De Ejemplo Numero 10 Las Palmas',
        category: 'Salud',
        description: 'Charla impartida por profesionales sobre gestión del estrés y bienestar emocional.'
    }
];


function getCustomEvents() {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
}

function saveCustomEvents(events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}




export function getAllEvents() {
    return [...INITIAL_EVENTS, ...getCustomEvents()];
}


export function getEventsByAssociation(associationId) {
    return getAllEvents().filter(e => e.associationId === associationId);
}


export function createEvent(eventData, association) {
    const newEvent = {
        ...eventData,
        id: Date.now(),
        associationId: association.id,
        associationNombre: association.nombre,
    };
    const events = getCustomEvents();
    saveCustomEvents([...events, newEvent]);
    return newEvent;
}


export function getEventById(id) {
    return getAllEvents().find(e => e.id === parseInt(id));
}


export function updateEvent(id, updates) {
    const events = getCustomEvents();
    const idx = events.findIndex(e => e.id === parseInt(id));
    if (idx === -1) return { error: 'Evento no encontrado' };

    events[idx] = { ...events[idx], ...updates };
    saveCustomEvents(events);
    return { event: events[idx] };
}
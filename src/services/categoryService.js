const CATEGORIES_KEY = 'adiuware_categories';
const DEFAULT_CATEGORIES = ['Animales', 'Salud', 'Comida'];

export function getCategories() {
    const stored = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
    if (!stored || stored.length === 0) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
    }
    return stored;
}

export function addCategory(nombre) {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
        return { error: 'El nombre no puede estar vacío' };
    }

    if (nombreLimpio.length > 30) {
        return { error: 'Máximo 30 caracteres' };
    }

    const categories = getCategories();

    if (categories.some(c => c.toLowerCase() === nombreLimpio.toLowerCase())) {
        return { error: 'Esta categoría ya existe' };
    }

    const updated = [...categories, nombreLimpio];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    return { categories: updated };
}
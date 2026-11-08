import { useState, useEffect } from 'react';
import { DataContext } from './DataContext';

export default function DataProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    });

    const [inscriptions, setInscriptions] = useState(() => {
        return JSON.parse(localStorage.getItem('inscriptions') || '[]');
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('inscriptions', JSON.stringify(inscriptions));
    }, [inscriptions]);

    const toggleFavorite = (eventId) => {
        setFavorites(prev =>
            prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
        );
    };

    const isFavorite = (eventId) => favorites.includes(eventId);

    const addInscription = (inscription) => {
        setInscriptions(prev => [...prev, inscription]);
    };

    const removeInscription = (eventId) => {
        setInscriptions(prev => prev.filter(i => i.eventId !== eventId));
    };

    const isInscrito = (eventId) => inscriptions.some(i => i.eventId === eventId);

    return (
        <DataContext.Provider value={{
            favorites,
            inscriptions,
            toggleFavorite,
            isFavorite,
            addInscription,
            removeInscription,
            isInscrito
        }}>
            {children}
        </DataContext.Provider>
    );
}
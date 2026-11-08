import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import EventCard from '../components/EventCard';
import favorite from '../assets/favorite.svg';
import favorite_white from '../assets/favorite_white.svg';
import { getCategories } from '../services/categoryService';
import { getCurrentUser } from '../services/userService';
import { getAllEvents, getEventsByAssociation } from '../services/eventService';

export default function Search() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const [query, setQuery] = useState('');
    const [categoria, setCategoria] = useState('Todas');


    const categorias = ['Todas', ...getCategories()];

    const user = getCurrentUser();
    const eventosBase = user?.tipo === 'asociacion'
        ? getEventsByAssociation(user.id)
        : getAllEvents();


    const filtered = eventosBase.filter(e => {
        const matchQuery = e.title.toLowerCase().includes(query.toLowerCase());
        const matchCat = categoria === 'Todas' || e.category === categoria;
        return matchQuery && matchCat;
    });

    return (
        
            <div className="page-content">
                <button className="header-back" onClick={() => navigate('/home')}>←</button>
                <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Buscar eventos</h2>

                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    style={{
                        padding: '12px 16px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--text-color)',
                        fontSize: '14px',
                        marginBottom: '15px',
                        outline: 'none'
                    }}
                />

                <div className="categories-scroll">
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoria(cat)}
                            className="category-pill"
                            style={{
                                opacity: categoria === cat ? 1 : 0.5,
                                border: categoria === cat ? '2px solid var(--primary)' : '2px solid transparent',
                                flexShrink: 0
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                        No se encontraron eventos
                    </p>
                ) : (
                    filtered.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isLight={isLight}
                            favoriteIcon={favorite}
                            favoriteWhiteIcon={favorite_white}
                        />
                    ))
                )}
            </div>
       
    );
}
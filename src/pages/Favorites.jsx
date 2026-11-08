import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useData } from '../hooks/useData';
import { getAllEvents } from '../services/eventService';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import favorite from '../assets/favorite.svg';

export default function Favorites() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { favorites } = useData();
    const isLight = theme === 'light';

    const favoriteEvents = getAllEvents().filter(e => favorites.includes(e.id));

    return (
        
            <div className="page-content">
                <button className="header-back" onClick={() => navigate(-1)}>←</button>
                <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Mis Favoritos</h2>

                {favoriteEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '14px' }}>Aún no tienes favoritos</p>
                        <p style={{ fontSize: '12px' }}>Pulsa el corazón en cualquier evento</p>
                    </div>
                ) : (
                    favoriteEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isLight={isLight}
                            favoriteIcon={favorite}
                        />
                    ))
                )}

                <BottomNav />
            </div>
       
    );
}
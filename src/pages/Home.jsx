import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import { getCurrentUser } from '../services/userService';
import { getAllEvents, getEventsByAssociation } from '../services/eventService';
import logomenu from '../assets/Adiuvare_Menu.svg';
import dark_mode from '../assets/dark_mode.svg';
import light_mode_white from '../assets/light_mode_white.svg';
import notifications from '../assets/notifications.svg';
import notifications_white from '../assets/notifications_white.svg';
import search from '../assets/search.svg';
import search_white from '../assets/search_white.svg';
import favorite from '../assets/favorite.svg';
import favorite_white from '../assets/favorite_white.svg';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const user = getCurrentUser();
  const isAsociacion = user?.tipo === 'asociacion';

  const displayedEvents = isAsociacion
    ? getEventsByAssociation(user.id)
    : getAllEvents();

  return (
   
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <img src={logomenu} alt="Logo Adiuvare" style={{ width: '100px', marginTop: '10px' , filter: isLight ? 'none' : 'brightness(0) invert(1)'}} />
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={toggleTheme} aria-label={isLight ? 'Activar modo oscuro' : 'Activar modo claro'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '10px' }}>
              <img src={isLight ? dark_mode : light_mode_white} alt="" aria-hidden="true" style={{ width: '24px', height: '24px' }} />
            </button>
            <button onClick={() => navigate('/notifications')} aria-label="Notificaciones" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '10px' }}>
              <img src={isLight ? notifications : notifications_white} alt="" aria-hidden="true" style={{ width: '24px', height: '24px' }} />
            </button>
          </div>
        </div>

     
        {user && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>
            Hola, <strong style={{ color: 'var(--text-color)' }}>{user.nombre}</strong>
            {isAsociacion && <span style={{ color: 'var(--primary)', fontSize: '11px', marginLeft: '8px' }}>· Asociación</span>}
          </p>
        )}

      
        <div
          onClick={() => navigate('/search')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
          style={{ backgroundColor: 'var(--input-bg)', padding: '12px 16px', borderRadius: '20px', marginBottom: '20px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img src={isLight ? search : search_white} alt="" aria-hidden="true" style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '14px' }}>Buscar Asociaciones...</span>
        </div>

       
        {isAsociacion && (
          <div style={{ width: '80%', margin: '0 auto 20px auto' }}>
            <Button variant="success" fullWidth onClick={() => navigate('/create-event')}>
              Crear Evento
            </Button>
          </div>
        )}

       
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
          {isAsociacion ? 'Mis Eventos Publicados' : 'Te puede interesar'}
        </h3>

        {displayedEvents.length === 0 && isAsociacion ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '14px' }}>Aún no has publicado ningún evento</p>
            <p style={{ fontSize: '12px' }}>Pulsa "Crear Evento" para empezar</p>
          </div>
        ) : (
          displayedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isLight={isLight}
              favoriteIcon={favorite}
              favoriteWhiteIcon={favorite_white}
            />
          ))
        )}

        <BottomNav />
      </div>
   
  );
}
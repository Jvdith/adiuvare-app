import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/userService';
import { getFavoritos, toggleFavorito } from '../services/apiService';

export default function EventCard({ event, isLight, favoriteIcon }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAsociacion = user?.tipoUsuario === 'ASOCIACION' || user?.tipo === 'asociacion';
  const isOwnEvent = isAsociacion && event.associationId === user?.idUsuario;

  const [favorited, setFavorited] = useState(false);

  // Solo voluntarios cargan favoritos
  useEffect(() => {
    if (isAsociacion || !user?.idUsuario) return;

    let mounted = true;
    getFavoritos(user.idUsuario)
      .then(favs => {
        if (mounted && Array.isArray(favs)) {
          setFavorited(favs.some(f => f.evento?.idEvento === event.id));
        }
      })
      .catch(() => { });
    return () => { mounted = false; };
  }, [event.id, isAsociacion, user?.idUsuario]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      const res = await toggleFavorito(user.idUsuario, event.id);
      setFavorited(res.favorito);
    } catch (err) {
      console.error('Error al toggle favorito:', err);
    }
  };

  const handleClick = () => {
    if (isOwnEvent) {
      navigate(`/edit-event/${event.id}`);
    } else if (!isAsociacion) {
      navigate(`/event/${event.id}`);
    }
  };

  return (
    <div
      className="event-card"
      onClick={handleClick}
      style={{
        cursor: (isAsociacion && !isOwnEvent) ? 'default' : 'pointer',
        position: 'relative'
      }}
    >
      {/* Corazón: solo voluntarios */}
      {!isAsociacion && (
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            opacity: favorited ? 1 : 0.35,
            transform: favorited ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <img
            src={favoriteIcon}
            alt=""
            aria-hidden="true"
            style={{ width: '22px', height: '22px', display: 'block' }}
          />
        </button>
      )}

      <h4 style={{ marginBottom: '5px', paddingRight: isAsociacion ? '0' : '30px' }}>
        {event.title}
      </h4>
      <p style={{ fontSize: '12px' }}>{event.date}</p>
      <p style={{ fontSize: '12px', marginBottom: '10px' }}>{event.loc}</p>

      {/* Texto inferior según rol */}
      {isAsociacion ? (
        isOwnEvent ? (
          <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: 'var(--primary)' }}>
            Editar evento →
          </p>
        ) : null
      ) : (
        <p style={{
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'right',
          color: '#1a1a1a'
        }}>
          Apuntarme +
        </p>
      )}
    </div>
  );
}
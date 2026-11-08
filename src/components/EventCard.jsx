import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { getCurrentUser } from '../services/userService';
import fondoRelleno from '../assets/fondo_relleno.svg';

export default function EventCard({ event, favoriteIcon}) {
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite, isInscrito } = useData();
    const user = getCurrentUser();
    const isAsociacion = user?.tipo === 'asociacion';
    const isOwnEvent = isAsociacion && event.associationId === user.id;

    const favorited = isFavorite(event.id);
    const inscribed = isInscrito(event.id);

    const handleClick = () => {
        if (isOwnEvent) {
            navigate(`/edit-event/${event.id}`);   
        } else if (!isAsociacion) {
            navigate(`/event/${event.id}`);       
        }
       
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(event.id);
    };

    return (
        <div
            className="event-card"
            onClick={handleClick}
            style={{ cursor: isAsociacion && !isOwnEvent ? 'default' : 'pointer', position: 'relative' }}
        >
            
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
                        transform: favorited ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        
                        {favorited && (
                            <img
                                src={fondoRelleno}
                                alt=""
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    width: '24px',
                                    height: '24px',
                                    display: 'block',
                                    pointerEvents: 'none'
                                }}
                            />
                        )}

                       
                        <img
                            src={favoriteIcon}
                            alt=""
                            aria-hidden="true"
                            style={{
                                width: '22px',
                                height: '22px',
                                display: 'block',
                                position: 'relative',
                                zIndex: 1
                            }}
                        />
                    </div>
                </button>
            )}

            <h4 style={{ marginBottom: '5px', paddingRight: isAsociacion ? '0' : '30px' }}>{event.title}</h4>
            <p style={{ fontSize: '12px' }}>{event.date}</p>
            <p style={{ fontSize: '12px', marginBottom: '10px' }}>{event.loc}</p>

           
            {isAsociacion ? (
                isOwnEvent ? (
                    <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: 'var(--primary)' }}>
                        Editar evento
                    </p>
                ) : null
            ) : (
                <p style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    color: inscribed ? '#2d6a4f' : '#1a1a1a'
                }}>
                    {inscribed ? 'Ya inscrito' : 'Apuntarme'}
                </p>
            )}
        </div>
    );
}
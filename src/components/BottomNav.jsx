import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { getCurrentUser } from '../services/userService';

import front_hand from '../assets/front_hand.svg';
import front_hand_white from '../assets/front_hand_white.svg';
import search from '../assets/search.svg';
import search_white from '../assets/search_white.svg';
import favorite from '../assets/favorite.svg';
import favorite_white from '../assets/favorite_white.svg';
import account_circle from '../assets/account_circle.svg';
import account_circle_white from '../assets/account_circle_white.svg';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const user = getCurrentUser();
  const isAsociacion = user?.tipo === 'asociacion';


  const items = [
    { path: '/home', icon: isLight ? front_hand : front_hand_white, label: 'Inicio' },
    { path: '/search', icon: isLight ? search : search_white, label: 'Buscar' },
    ...(!isAsociacion
      ? [{ path: '/favorites', icon: isLight ? favorite : favorite_white, label: 'Favoritos' }]
      : []),
    { path: '/profile', icon: isLight ? account_circle : account_circle_white, label: 'Mi perfil' },
  ];

  return (
    <nav
      aria-label="Navegación inferior"
      style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px 0',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-color)',
        position: 'sticky',
        bottom: '0'
      }}
    >
      {items.map(item => {
        const activo = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            aria-current={activo ? 'page' : undefined}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              opacity: activo ? 1 : 0.5,
              transition: 'opacity 0.2s'
            }}
          >
            <img src={item.icon} alt="" aria-hidden="true" style={{ width: '24px', height: '24px', display: 'block' }} />
          </button>
        );
      })}
    </nav>
  );
}
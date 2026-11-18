import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';          
import Button from '../components/Button';
import { getCurrentUser } from '../services/userService';
import { getFavoritos } from '../services/apiService';
import favorite from '../assets/favorite.svg';

export default function Favorites() {
  const { theme } = useTheme();
  const user = getCurrentUser();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    async function cargar() {
      const data = await getFavoritos(user.idUsuario);
      setFavoritos(data);
    }
    cargar();
  }, [user?.idUsuario]);

  return (
    <div className="page-content">
      <h2>Mis Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>No tienes favoritos todavía</p>
      ) : (
        favoritos.map(fav => (
          <EventCard
            key={fav.evento.idEvento}
            event={{
              id: fav.evento.idEvento,
              title: fav.evento.titulo,
              date: fav.evento.fechaHora,
              loc: fav.evento.ubicacion,
              category: fav.evento.categoria?.nombre,
              associationId: fav.evento.asociacion?.idUsuario
            }}
            isLight={theme === 'light'}
            favoriteIcon={favorite}
          />
        ))
      )}
      <BottomNav />
    </div>
  );
}
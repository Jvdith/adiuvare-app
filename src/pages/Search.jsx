import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import favorite from '../assets/favorite.svg';
import { getCurrentUser } from '../services/userService';
import { getEventos, getEventosPorAsociacion, getCategorias } from '../services/apiService';

export default function Search() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const user = getCurrentUser();
  const isAsociacion = user?.tipoUsuario === 'ASOCIACION';

  const [query, setQuery] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaSel, setCategoriaSel] = useState('Todas');
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    async function cargar() {
      try {
        const [evs, cats] = await Promise.all([
          isAsociacion ? getEventosPorAsociacion(user.idUsuario) : getEventos(),
          getCategorias()
        ]);
        setEventos(evs);
        setCategorias(cats);
      } catch {
        setEventos([]);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [isAsociacion, user?.idUsuario]);

  const filtrados = eventos.filter(e => {
    const matchQuery = e.titulo?.toLowerCase().includes(query.toLowerCase());
    const matchCat = categoriaSel === 'Todas' || e.categoria?.nombre === categoriaSel;
    return matchQuery && matchCat;
  });

  if (loading) return <div className="page-content">Cargando...</div>;

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
        style={{ padding: '12px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', fontSize: '14px', marginBottom: '15px', outline: 'none' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
        <button onClick={() => setCategoriaSel('Todas')} className="category-pill" style={{ opacity: categoriaSel === 'Todas' ? 1 : 0.5 }}>Todas</button>
        {categorias.map(cat => (
          <button
            key={cat.idCategoria}
            onClick={() => setCategoriaSel(cat.nombre)}
            className="category-pill"
            style={{ opacity: categoriaSel === cat.nombre ? 1 : 0.5 }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No se encontraron eventos</p>
      ) : (
        filtrados.map(ev => (
          <EventCard
            key={ev.idEvento}
            event={{
              id: ev.idEvento,
              title: ev.titulo,
              date: ev.fechaHora,
              loc: ev.ubicacion,
              category: ev.categoria?.nombre,
              associationId: ev.asociacion?.idUsuario
            }}
            isLight={isLight}
            favoriteIcon={favorite}
          />
        ))
      )}

      <BottomNav />
    </div>
  );
}
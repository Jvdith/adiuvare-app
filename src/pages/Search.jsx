import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import { getCurrentUser } from '../services/userService';
import { getEventos, getEventosPorAsociacion, getCategorias } from '../services/apiService';
import favorite from '../assets/favorite.svg';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const user = getCurrentUser();
  const isAsociacion = user?.tipoUsuario === 'ASOCIACION';

  
  const [query, setQuery] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('Todas');

  
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [queryError, setQueryError] = useState('');
  const [toast, setToast] = useState('');

 
  useEffect(() => {
    async function cargar() {
      setLoading(true);
      setError('');
      try {
        const [evs, cats] = await Promise.all([
          isAsociacion ? getEventosPorAsociacion(user.idUsuario) : getEventos(),
          getCategorias()
        ]);
        setEventos(Array.isArray(evs) ? evs : []);
        setCategorias(Array.isArray(cats) ? cats : []);
      } catch {
        setError('No se pudo conectar al servidor. Revisa tu conexión.');
        setEventos([]);
      } finally {
        setLoading(false);
      }
    }
    if (user) cargar();
  }, [isAsociacion, user?.idUsuario, location.key]);

  
  const handleQueryChange = (e) => {
    const valor = e.target.value;
    setQuery(valor);
    if (valor.length > 0 && valor.length < 2) {
      setQueryError('Escribe al menos 2 caracteres');
    } else if (valor.length > 50) {
      setQueryError('Máximo 50 caracteres');
    } else {
      setQueryError('');
    }
  };


  const handleCategoriaChange = (nombre) => {
    setCategoriaSel(nombre);
    setToast(`Filtro aplicado: ${nombre === 'Todas' ? 'Sin categoría' : nombre}`);
    setTimeout(() => setToast(''), 2500);
  };


  const quitarFiltroTexto = () => { setQuery(''); setQueryError(''); };
  const quitarFiltroCategoria = () => setCategoriaSel('Todas');

  
  const limpiarFiltros = () => {
    setQuery('');
    setQueryError('');
    setCategoriaSel('Todas');
    setToast('Filtros eliminados');
    setTimeout(() => setToast(''), 2000);
  };


  const hayFiltrosActivos = query.length > 0 || categoriaSel !== 'Todas';
  const filtrados = eventos.filter(e => {
    const matchQuery = query.length < 2 || e.titulo?.toLowerCase().includes(query.toLowerCase());
    const matchCat = categoriaSel === 'Todas' || e.categoria?.nombre === categoriaSel;
    return matchQuery && matchCat;
  });

  if (loading) {
    return (
      <div className="page-content">
        <button className="header-back" onClick={() => navigate('/home')}>←</button>
        <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Buscar eventos</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
          Cargando eventos...
        </p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page-content">
      <button className="header-back" onClick={() => navigate('/home')}>←</button>
      <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Buscar eventos</h2>

      
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            backgroundColor: 'rgba(255,107,107,0.1)',
            border: '1px solid var(--red)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <p style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--red)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        style={{ marginBottom: '15px' }}
      >
        <label htmlFor="search-input" style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
          Buscar por nombre
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Ej: recogida, paseo, charla..."
          value={query}
          onChange={handleQueryChange}
          maxLength={50}
          aria-invalid={!!queryError}
          aria-describedby={queryError ? 'search-error' : undefined}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '20px',
            border: queryError ? '2px solid var(--red)' : '1px solid var(--border-color)',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-color)',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        {queryError && (
          <p
            id="search-error"
            role="alert"
            aria-live="polite"
            style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}
          >
            {queryError}
          </p>
        )}
      </form>

    
      <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
        Filtrar por categoría
      </label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
        <button
          onClick={() => handleCategoriaChange('Todas')}
          className="category-pill"
          style={{ opacity: categoriaSel === 'Todas' ? 1 : 0.5 }}
        >
          Todas
        </button>
        {categorias.map(cat => (
          <button
            key={cat.idCategoria}
            onClick={() => handleCategoriaChange(cat.nombre)}
            className="category-pill"
            style={{ opacity: categoriaSel === cat.nombre ? 1 : 0.5 }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      
      {hayFiltrosActivos && (
        <div style={{ marginBottom: '15px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Filtros activos:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {query.length >= 2 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'var(--primary)', color: 'white',
                padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
              }}>
                "{query}"
                <button
                  onClick={quitarFiltroTexto}
                  aria-label={`Quitar filtro de búsqueda "${query}"`}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}
                >
                  ✕
                </button>
              </span>
            )}
            {categoriaSel !== 'Todas' && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'var(--primary)', color: 'white',
                padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
              }}>
                {categoriaSel}
                <button
                  onClick={quitarFiltroCategoria}
                  aria-label={`Quitar filtro de categoría ${categoriaSel}`}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}
                >
                  ✕
                </button>
              </span>
            )}
            <button
              onClick={limpiarFiltros}
              style={{
                background: 'none', border: '1px dashed var(--primary)', color: 'var(--primary)',
                padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Limpiar todo
            </button>
          </div>
        </div>
      )}

      
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'var(--primary)', color: 'white',
            padding: '10px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
            zIndex: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          {toast}
        </div>
      )}

      
      <p
        role="status"
        aria-live="polite"
        style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}
      >
        {filtrados.length === 0
          ? 'Sin resultados'
          : `${filtrados.length} ${filtrados.length === 1 ? 'evento encontrado' : 'eventos encontrados'}`}
      </p>

      
      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            {hayFiltrosActivos
              ? 'No se encontraron eventos con estos filtros'
              : 'No hay eventos disponibles'}
          </p>
          {hayFiltrosActivos && (
            <p style={{ fontSize: '12px', marginBottom: '20px' }}>
              Prueba a cambiar los criterios de búsqueda
            </p>
          )}
          {hayFiltrosActivos && (
            <div style={{ width: '80%', margin: '0 auto' }}>
              <Button onClick={limpiarFiltros} fullWidth>Limpiar filtros</Button>
            </div>
          )}
        </div>
      ) : (
        filtrados.map(ev => (
          <EventCard
            key={ev.idEvento}
            event={{
              id: ev.idEvento,
              title: ev.titulo,
              date: ev.fechaHora?.replace('T', ' ').substring(0, 16),
              loc: ev.ubicacion,
              category: ev.categoria?.nombre,
              associationId: ev.asociacion?.idUsuario,
              numInscritos: ev.numInscritos ?? 0
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
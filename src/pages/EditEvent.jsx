import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getCurrentUser } from '../services/userService';
import { getEvento, updateEvento, deleteEvento, getCategorias } from '../services/apiService';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState(null);
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    async function cargar() {
      try {
        const [ev, cats] = await Promise.all([getEvento(id), getCategorias()]);
        if (!ev || ev.error) { setLoading(false); return; }
        setEvento(ev);
        setTitulo(ev.titulo || '');
        setDescripcion(ev.descripcion || '');
        setUbicacion(ev.ubicacion || '');
        setIdCategoria(ev.categoria?.idCategoria || (cats[0]?.idCategoria ?? null));
        if (ev.fechaHora) {
          const [f, h] = ev.fechaHora.split('T');
          setFecha(f);
          setHora(h?.substring(0, 5) || '');
        }
        setCategorias(cats);
      } catch {
        setError('Error al cargar el evento');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  if (loading) return <div className="page-content">Cargando...</div>;

  if (!user || user.tipoUsuario !== 'ASOCIACION' || !evento || evento.asociacion?.idUsuario !== user.idUsuario) {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2>Acceso restringido</h2>
        <div style={{ width: '80%', margin: '20px auto 0' }}>
          <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !ubicacion.trim() || !idCategoria) {
      setError('Rellena todos los campos obligatorios');
      return;
    }
    await updateEvento(id, {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fechaHora: fecha && hora ? `${fecha}T${hora}:00` : evento.fechaHora,
      ubicacion: ubicacion.trim()
    });
    navigate('/home');
  };

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres eliminar este evento?')) {
      await deleteEvento(id);
      navigate('/home');
    }
  };

  return (
    <div className="page-content">
      <button className="header-back" onClick={() => navigate('/home')}>←</button>
      <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Editar Evento</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Input label="Título" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <Input label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <Input label="Hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        <Input label="Ubicación" required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px', display: 'block', color: 'var(--text-color)' }}>Categoría</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categorias.map(cat => (
              <button
                key={cat.idCategoria}
                type="button"
                onClick={() => setIdCategoria(cat.idCategoria)}
                className="category-pill"
                style={{
                  opacity: idCategoria === cat.idCategoria ? 1 : 0.5,
                  border: idCategoria === cat.idCategoria ? '2px solid var(--primary)' : '2px solid transparent'
                }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

        <div style={{ width: '80%', margin: '20px auto 10px auto', display: 'flex', gap: '10px' }}>
          <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/home')}>Cancelar</Button>
          <Button type="submit" variant="success" fullWidth>Guardar</Button>
        </div>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Button type="button" variant="danger" fullWidth onClick={handleDelete}>Eliminar evento</Button>
        </div>
      </form>
    </div>
  );
}
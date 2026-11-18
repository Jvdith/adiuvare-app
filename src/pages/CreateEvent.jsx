import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getCurrentUser } from '../services/userService';
import { getCategorias, createCategoria, createEvento } from '../services/apiService';

export default function CreateEvent() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState(null);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [nuevaCat, setNuevaCat] = useState('');
  const [errorCat, setErrorCat] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    getCategorias().then(data => {
      setCategorias(data);
      if (data.length > 0) setIdCategoria(data[0].idCategoria);
    });
  }, []);

  if (!user || user.tipoUsuario !== 'ASOCIACION') {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2>Acceso restringido</h2>
        <p style={{ color: 'var(--text-muted)' }}>Solo las asociaciones pueden crear eventos</p>
        <div style={{ width: '80%', margin: '20px auto 0' }}>
          <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleAddCategory = async () => {
    if (!nuevaCat.trim()) { setErrorCat('El nombre no puede estar vacío'); return; }
    const res = await createCategoria(nuevaCat.trim());
    if (res.error) { setErrorCat(res.error); return; }

    const actualizadas = await getCategorias();
    setCategorias(actualizadas);
    setIdCategoria(res.idCategoria);
    setNuevaCat('');
    setErrorCat('');
    setMostrarNueva(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim() || !fecha || !hora || !ubicacion.trim() || !idCategoria) {
      setError('Rellena todos los campos obligatorios');
      return;
    }

    setSaving(true);
    try {
      await createEvento({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fechaHora: `${fecha}T${hora}:00`,
        ubicacion: ubicacion.trim(),
        idAsociacion: user.idUsuario,
        idCategoria: idCategoria
      });
      navigate('/home');
    } catch (err) {
      setError('Error al crear el evento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">
      <button className="header-back" onClick={() => navigate('/home')}>←</button>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px' }}>Crear Evento</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Input label="Título" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Recogida de alimentos" />
        <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe el evento" />
        <Input label="Fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <Input label="Hora" type="time" required value={hora} onChange={(e) => setHora(e.target.value)} />
        <Input label="Ubicación" required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="C/ Ejemplo 123" />

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px', display: 'block', color: 'var(--text-color)' }}>Tipo de evento</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
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
            <button
              type="button"
              onClick={() => setMostrarNueva(!mostrarNueva)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '2px dashed var(--primary)', background: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Nueva categoría
            </button>
          </div>

          {mostrarNueva && (
            <div style={{ marginTop: '10px', padding: '12px', backgroundColor: 'var(--input-bg)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={nuevaCat}
                  onChange={(e) => { setNuevaCat(e.target.value); setErrorCat(''); }}
                  placeholder="Nombre de la categoría"
                  maxLength={50}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', outline: 'none' }}
                />
                <button type="button" onClick={handleAddCategory} style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                  Añadir
                </button>
              </div>
              {errorCat && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '8px' }}>{errorCat}</p>}
            </div>
          )}
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

        <div style={{ width: '80%', margin: '20px auto 0 auto' }}>
          <Button type="submit" fullWidth disabled={saving}>{saving ? 'Creando...' : 'Publicar Evento'}</Button>
        </div>
      </form>
    </div>
  );
}
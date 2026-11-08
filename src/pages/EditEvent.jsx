import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getCurrentUser } from '../services/userService';
import { getEventById, updateEvent } from '../services/eventService';
import { getCategories, addCategory } from '../services/categoryService';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = getCurrentUser();
    const evento = getEventById(id);

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [categorias, setCategorias] = useState(getCategories());
    const [categoria, setCategoria] = useState('');
    const [mostrarNueva, setMostrarNueva] = useState(false);
    const [nuevaCat, setNuevaCat] = useState('');
    const [errorCat, setErrorCat] = useState('');
    const [error, setError] = useState('');

    
    useEffect(() => {
        if (!evento) return;
        setTitulo(evento.title || '');
        setDescripcion(evento.description || '');
        setUbicacion(evento.loc || '');
        setCategoria(evento.category || '');
        setFecha('');
        setHora('');
    }, [evento]);

  
    if (!user || user.tipo !== 'asociacion' || !evento || evento.associationId !== user.id) {
        return (
         
                <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>Acceso restringido</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                        No puedes editar este evento
                    </p>
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
                    </div>
                </div>
          
        );
    }

    const handleAddCategory = () => {
        const result = addCategory(nuevaCat);
        if (result.error) { setErrorCat(result.error); return; }
        setCategorias(result.categories);
        setCategoria(nuevaCat.trim());
        setNuevaCat('');
        setErrorCat('');
        setMostrarNueva(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!titulo.trim() || !ubicacion.trim() || !categoria) {
            setError('Rellena todos los campos obligatorios');
            return;
        }

        const nuevaFecha = fecha && hora ? `${fecha} ${hora}` : evento.date;

        updateEvent(evento.id, {
            title: titulo.trim(),
            description: descripcion.trim(),
            date: nuevaFecha,
            loc: ubicacion.trim(),
            category: categoria,
        });

        navigate('/home');
    };

    const handleDelete = () => {
        if (window.confirm('¿Seguro que quieres eliminar este evento?')) {
            const events = JSON.parse(localStorage.getItem('adiuware_events') || '[]');
            const filtered = events.filter(e => e.id !== evento.id);
            localStorage.setItem('adiuware_events', JSON.stringify(filtered));
            navigate('/home');
        }
    };

    return (
        <Layout>
            <div className="page-content">
                <button className="header-back" onClick={() => navigate('/home')}>←</button>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px' }}>Editar Evento</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
                        Modifica los datos de tu evento
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Input label="Título del evento" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                    <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                    <Input label="Fecha (opcional)" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                    <Input label="Hora (opcional)" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
                    <Input label="Ubicación" required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px', display: 'block', color: 'var(--text-color)' }}>
                            Tipo de evento
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {categorias.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategoria(cat)}
                                    className="category-pill"
                                    style={{
                                        opacity: categoria === cat ? 1 : 0.5,
                                        border: categoria === cat ? '2px solid var(--primary)' : '2px solid transparent'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setMostrarNueva(!mostrarNueva)}
                                style={{ padding: '8px 14px', borderRadius: '20px', border: '2px dashed var(--primary)', background: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                + Nueva
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
                                        maxLength={30}
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                        style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '14px', outline: 'none' }}
                                    />
                                    <button type="button" onClick={handleAddCategory} style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                                        Añadir
                                    </button>
                                </div>
                                {errorCat && <p role="alert" style={{ color: 'var(--red)', fontSize: '12px', marginTop: '8px' }}>{errorCat}</p>}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div role="alert" aria-live="assertive" style={{ margin: '8px 0' }}>
                            <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>
                        </div>
                    )}

                    <div style={{ width: '80%', margin: '20px auto 10px auto', display: 'flex', gap: '10px' }}>
                        <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/home')}>Cancelar</Button>
                        <Button type="submit" variant="success" fullWidth>Guardar</Button>
                    </div>

                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <Button type="button" variant="danger" fullWidth onClick={handleDelete}>
                            Eliminar evento
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
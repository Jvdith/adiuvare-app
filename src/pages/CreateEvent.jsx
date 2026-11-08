import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getCurrentUser } from '../services/userService';
import { createEvent } from '../services/eventService';
import { getCategories, addCategory } from '../services/categoryService';

export default function CreateEvent() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [ubicacion, setUbicacion] = useState('');

    const [categorias, setCategorias] = useState(getCategories());
    const [categoria, setCategoria] = useState(getCategories()[0] || '');
    const [mostrarNueva, setMostrarNueva] = useState(false);
    const [nuevaCat, setNuevaCat] = useState('');
    const [errorCat, setErrorCat] = useState('');
    const [error, setError] = useState('');

    if (!user || user.tipo !== 'asociacion') {
        return (
            
                <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>Acceso restringido</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                        Solo las asociaciones pueden crear eventos
                    </p>
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
                    </div>
                </div>
           
        );
    }

    const handleAddCategory = () => {
        const result = addCategory(nuevaCat);
        if (result.error) {
            setErrorCat(result.error);
            return;
        }
        setCategorias(result.categories);
        setCategoria(nuevaCat.trim());
        setNuevaCat('');
        setErrorCat('');
        setMostrarNueva(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!titulo.trim() || !fecha || !hora || !ubicacion.trim() || !categoria) {
            setError('Rellena todos los campos obligatorios');
            return;
        }

        createEvent(
            {
                title: titulo.trim(),
                description: descripcion.trim(),
                date: `${fecha} ${hora}`,
                loc: ubicacion.trim(),
                category: categoria,
            },
            user
        );

        navigate('/home');
    };

    return (
        
            <div className="page-content">
                <button className="header-back" onClick={() => navigate('/home')}>←</button>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px' }}>Crear Evento</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
                        Publica un nuevo evento para tus voluntarios
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Input label="Título del evento" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Recogida de alimentos" />
                    <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe brevemente el evento" />
                    <Input label="Fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
                    <Input label="Hora" type="time" required value={hora} onChange={(e) => setHora(e.target.value)} />
                    <Input label="Ubicación" required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ej: C/ Callecita 8, Las Palmas" />

                    
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
                                aria-label="Añadir nueva categoría"
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '20px',
                                    border: '2px dashed var(--primary)',
                                    background: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
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
                                        style={{
                                            flex: 1,
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: 'var(--bg-color)',
                                            color: 'var(--text-color)',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'var(--primary)',
                                            color: '#fff',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Añadir
                                    </button>
                                </div>

                                {errorCat && (
                                    <p role="alert" style={{ color: 'var(--red)', fontSize: '12px', marginTop: '8px' }}>
                                        {errorCat}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div role="alert" aria-live="assertive" style={{ margin: '8px 0' }}>
                            <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>
                        </div>
                    )}

                    <div style={{ width: '80%', margin: '20px auto 0 auto' }}>
                        <Button type="submit" fullWidth>Publicar Evento</Button>
                    </div>
                </form>
            </div>
        
    );
}
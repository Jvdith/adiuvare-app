import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getCurrentUser } from '../services/userService';
import { getEvento, createInscripcion, getInscripciones } from '../services/apiService';

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yaInscrito, setYaInscrito] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    async function cargar() {
      try {
        const ev = await getEvento(id);
        setEvento(ev);

        if (user) {
          const inscripciones = await getInscripciones(user.idUsuario);
          setYaInscrito(inscripciones.some(i => i.evento?.idEvento === parseInt(id)));
        }
      } catch {
        setError('Error al cargar el evento');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id, user?.idUsuario]);

  if (loading) return <div className="page-content">Cargando...</div>;

  if (!evento || evento.error) {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2>Evento no encontrado</h2>
        <div style={{ width: '80%', margin: '20px auto 0' }}>
          <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  if (user?.tipoUsuario === 'ASOCIACION') {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2>Acción no disponible</h2>
        <p style={{ color: 'var(--text-muted)' }}>Las asociaciones no pueden inscribirse</p>
        <div style={{ width: '80%', margin: '20px auto 0' }}>
          <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  if (yaInscrito) {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2>✓ Ya estás inscrito</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{evento.titulo}</p>
        <div style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button onClick={() => navigate('/my-inscriptions')}>Ver mis inscripciones</Button>
          <Button variant="secondary" onClick={() => navigate('/home')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2>¡Inscripción confirmada!</h2>
        <div style={{ border: '2px solid var(--green)', borderRadius: '12px', padding: '20px', width: '80%', marginBottom: '30px' }}>
          <p style={{ color: 'var(--green)', fontWeight: 'bold' }}>Te has inscrito correctamente</p>
        </div>
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button onClick={() => navigate('/my-inscriptions')}>Ver mis inscripciones</Button>
          <Button variant="secondary" onClick={() => navigate('/home')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createInscripcion({
        idVoluntario: user.idUsuario,
        idEvento: parseInt(id),
        nombre: nombre.trim(),
        correoContacto: email.trim()
      });
      setSuccess(true);
    } catch {
      setError('Error al inscribirse');
    }
  };

  return (
    <div className="page-content">
      <button className="header-back" onClick={() => navigate('/home')}>←</button>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px' }}>Apuntarme al Evento</h2>
        <p style={{ fontSize: '13px', fontWeight: '600' }}>{evento.titulo}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{evento.fechaHora?.replace('T', ' ').substring(0, 16)}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{evento.ubicacion}</p>
      </div>

      <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Input label="Nombre Completo" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <Input label="Correo de contacto" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        {error && <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

        <div style={{ width: '80%', margin: '20px auto 0', display: 'flex', gap: '12px' }}>
          <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(true)}>Cancelar</Button>
          <Button type="submit" variant="primary" fullWidth>Confirmar</Button>
        </div>
      </form>

      {showModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, borderRadius: '40px' }}>
          <div role="dialog" aria-modal="true" style={{ backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '16px', width: '75%', maxWidth: '250px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-color)' }}>¿Seguro que quieres cancelar?</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="success" fullWidth onClick={() => navigate('/home')}>Sí</Button>
              <Button variant="danger" fullWidth onClick={() => setShowModal(false)}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
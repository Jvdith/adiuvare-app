import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getCurrentUser } from '../services/userService';
import { getInscripciones, deleteInscripcion } from '../services/apiService';

export default function MyInscriptions() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

 
  useEffect(() => {
    async function cargar() {
      if (!user) return;
      const data = await getInscripciones(user.idUsuario);
      setInscripciones(data);
      setLoading(false);
    }
    cargar();
  }, [user?.idUsuario]);

  const handleCancel = async (idInscripcion) => {
    await deleteInscripcion(idInscripcion);
    setInscripciones(prev => prev.filter(i => i.idInscripcion !== idInscripcion));
    setConfirmId(null);
  };

  if (loading) return <div className="page-content">Cargando...</div>;

  return (
    <div className="page-content">
      <button className="header-back" onClick={() => navigate('/profile')}>←</button>
      <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Mis Inscripciones</h2>

      {inscripciones.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '48px', marginBottom: '10px' }}>📋</p>
          <p style={{ fontSize: '14px' }}>Aún no te has inscrito en ningún evento</p>
          <div style={{ width: '80%', margin: '30px auto 0' }}>
            <Button onClick={() => navigate('/home')} fullWidth>Explorar eventos</Button>
          </div>
        </div>
      ) : (
        inscripciones.map(ins => (
          <div key={ins.idInscripcion} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
            <h4 style={{ marginBottom: '6px', color: 'var(--text-color)' }}>{ins.evento.titulo}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ins.evento.fechaHora?.replace('T', ' ').substring(0, 16)}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{ins.evento.ubicacion}</p>
            <div style={{ width: '80%', margin: '0 auto' }}>
              <Button variant="danger" fullWidth onClick={() => setConfirmId(ins.idInscripcion)}>Cancelar inscripción</Button>
            </div>
          </div>
        ))
      )}

      {confirmId && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, borderRadius: '40px' }}>
          <div role="dialog" aria-modal="true" style={{ backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '16px', width: '75%', maxWidth: '250px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-color)' }}>¿Cancelar esta inscripción?</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="success" fullWidth onClick={() => handleCancel(confirmId)}>Sí</Button>
              <Button variant="danger" fullWidth onClick={() => setConfirmId(null)}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getEventById } from '../services/eventService';
import { useData } from '../hooks/useData';

export default function MyInscriptions() {
    const navigate = useNavigate();
    const { inscriptions, removeInscription } = useData();
    const [confirmId, setConfirmId] = useState(null);

    return (

        <div className="page-content">
            <button className="header-back" onClick={() => navigate('/profile')}>←</button>
            <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Mis Inscripciones</h2>

            {inscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '14px' }}>Aún no te has inscrito en ningún evento</p>
                    <div style={{ width: '80%', margin: '30px auto 0 auto'}}>
                        <Button onClick={() => navigate('/home')} fullWidth>Explorar eventos</Button>
                    </div>
                </div>
            ) : (
                inscriptions.map(ins => {
                    const event = getEventById(ins.eventId);
                    if (!event) return null;
                    return (
                        <div
                            key={ins.eventId}
                            style={{
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px',
                                padding: '16px',
                                marginBottom: '12px'
                            }}
                        >
                            <h4 style={{ marginBottom: '6px', color: 'var(--text-color)' }}>{event.title}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{event.date}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>{event.loc}</p>
                            <div style={{ width: '80%', margin: '0 auto' }}>
                                <Button variant="danger" fullWidth onClick={() => setConfirmId(ins.eventId)}>
                                    Cancelar inscripción
                                </Button>
                            </div>
                        </div>
                    );
                })
            )}

            {confirmId && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div role="dialog" aria-modal="true" style={{ backgroundColor: 'var(--bg-color)', padding: '30px', borderRadius: '20px', width: '80%', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '16px', color: 'var(--text-color)' }}>
                            ¿Cancelar esta inscripción?
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="success" fullWidth onClick={() => { removeInscription(confirmId); setConfirmId(null); }}>Sí</Button>
                            <Button variant="danger" fullWidth onClick={() => setConfirmId(null)}>No</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
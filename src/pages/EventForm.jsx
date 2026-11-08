import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { getEventById } from '../services/eventService';
import { useData } from '../hooks/useData';
import { getCurrentUser } from '../services/userService';

export default function EventForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = getEventById(id);
    const { addInscription, isInscrito } = useData();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const user = getCurrentUser();


    if (user?.tipo === 'asociacion') {
        return (
           
                <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>Acción no disponible</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                        Las asociaciones no pueden inscribirse en eventos
                    </p>
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
                    </div>
                </div>
           
        );
    }

    if (!event) {
        return (
          
                <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <h2>Evento no encontrado</h2>
                    <Button onClick={() => navigate('/home')}>Volver al inicio</Button>
                </div>
          
        );
    }

    if (isInscrito(event.id)) {
        return (
           
                <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>✓ Ya estás inscrito</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                        Ya tienes una plaza reservada para "{event.title}"
                    </p>
                    <div style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button onClick={() => navigate('/my-inscriptions')}>Ver mis inscripciones</Button>
                        <Button variant="secondary" onClick={() => navigate('/home')}>Volver al inicio</Button>
                    </div>
                </div>
           
        );
    }

    if (success) {
        return (
            
                <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>¡Inscripción confirmada!</h2>
                    <div style={{ border: '2px solid var(--green)', borderRadius: '12px', padding: '20px', width: '100%', marginBottom: '30px' }}>
                        <p style={{ color: 'var(--green)', fontWeight: 'bold' }}>Te has inscrito correctamente</p>
                        <p style={{ fontSize: '13px', marginTop: '8px', color: 'var(--text-color)' }}>{event.title}</p>
                    </div>
                    <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button onClick={() => navigate('/my-inscriptions')}>Ver mis inscripciones</Button>
                        <Button variant="secondary" onClick={() => navigate('/home')}>Volver al inicio</Button>
                    </div>
                </div>
            
        );
    }

    const handleConfirm = (e) => {
        e.preventDefault();
        addInscription({
            eventId: event.id,
            nombre,
            email,
            telefono,
            fecha: new Date().toLocaleDateString('es-ES')
        });
        setSuccess(true);
    };

    return (
       
            <div className="page-content">
                <button className="header-back" onClick={() => navigate('/home')}>←</button>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Apuntarme al Evento</h2>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-color)' }}>{event.title}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{event.date}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{event.loc}</p>
                </div>

                <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Input label="Nombre Completo" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Judith Santana" />
                    <Input label="Correo de contacto" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
                    <Input label="Teléfono" type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Introduce tu número" />

                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px', width: '80%', margin: '20px auto 0 auto' }}>
                        <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(true)}>Cancelar</Button>
                        <Button type="submit" variant="primary" fullWidth>Confirmar</Button>
                    </div>
                </form>

                {showModal && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                        <div role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{ backgroundColor: 'var(--bg-color)', padding: '30px', borderRadius: '20px', width: '80%', textAlign: 'center' }}>
                            <h3 id="modal-title" style={{ marginBottom: '20px', fontSize: '16px', color: 'var(--text-color)' }}>
                                ¿Estás seguro de que quieres cancelar?
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button variant="success" fullWidth onClick={() => navigate('/home')}>Sí</Button>
                                <Button variant="danger" fullWidth onClick={() => setShowModal(false)}>No</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
      
    );
}
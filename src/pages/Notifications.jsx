import { useNavigate } from 'react-router-dom';

export default function Notifications() {
    const navigate = useNavigate();

    const notifications = [
        { id: 1, title: 'Recordatorio', message: 'Recogida de alimentos mañana a las 12:00' },
        { id: 2, title: 'Inscripción confirmada', message: 'Tu plaza para "Paseo de perros" está reservada' },
        { id: 3, title: 'Nueva asociación', message: 'Huellitas Las Palmas se ha unido a Adiuvare' },
        { id: 4, title: 'Bienvenido/a', message: '¡Gracias por unirte a Adiuvare! Juntos hacemos más.' }
    ];

    return (
        <div className="page-content">
            <button className="header-back" onClick={() => navigate('/home')}>←</button>
            <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Notificaciones</h2>

            {notifications.map(n => (
                <div
                    key={n.id}
                    style={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '14px',
                        marginBottom: '12px'
                    }}
                >
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-color)', marginBottom: '6px' }}>
                        {n.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-color)' }}>
                        {n.message}
                    </p>
                </div>
            ))}
        </div>
    );
}
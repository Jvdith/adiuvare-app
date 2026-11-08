import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { createUser, setCurrentUser } from '../services/userService';

export default function Register() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('voluntario'); 
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setServerError('');

    if (password.length < 8) {
      setServerError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const result = createUser({ nombre, email, password, tipo });

    if (result.error) {
      setServerError(result.error);
      return;
    }

    setCurrentUser(result.user);
    setSuccess(true);
  };

  if (success) {
    return (
     
        <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Crear una cuenta</h2>
          <div style={{ border: '2px solid var(--yellow)', borderRadius: '12px', padding: '20px', width: '100%', textAlign: 'center', marginBottom: '30px', backgroundColor: 'var(--yellow)' }}>
            <p style={{ color: 'var(--yellow-text)', fontWeight: 'bold' }}>Cuenta registrada con éxito</p>
          </div>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <Button onClick={() => navigate('/home')} variant="success" fullWidth>
              Ir al Inicio
            </Button>
          </div>
        </div>
     
    );
  }

  return (
    
      <div className="page-content">
        <button className="header-back" onClick={() => navigate('/')}>←</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>Crear una cuenta de<br />Adiuvare</h2>
        </div>

       
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
          <button
            type="button"
            onClick={() => setTipo('asociacion')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '2px solid var(--primary)',
              backgroundColor: tipo === 'asociacion' ? 'var(--primary)' : 'transparent',
              color: tipo === 'asociacion' ? '#fff' : 'var(--text-color)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Asociación
          </button>
          <button
            type="button"
            onClick={() => setTipo('voluntario')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '2px solid var(--primary)',
              backgroundColor: tipo === 'voluntario' ? 'var(--primary)' : 'transparent',
              color: tipo === 'voluntario' ? '#fff' : 'var(--text-color)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Voluntario
          </button>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Input
            label={tipo === 'asociacion' ? 'Nombre de la Asociación' : 'Nombre Completo'}
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={tipo === 'asociacion' ? 'Ej: Huellitas Las Palmas' : 'Ej: Judith Santana'}
          />
          <Input
            label="Correo electrónico"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres..."
          />

          {serverError && (
            <div role="alert" aria-live="assertive" style={{ margin: '8px 0' }}>
              <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{serverError}</p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '15px 0', fontSize: '12px' }}>
            <input type="checkbox" required style={{ accentColor: 'var(--primary)' }} />
            <label>Acepto los términos y políticas de privacidad</label>
          </div>

          <div style={{ width: '80%', margin: '0 auto' }}>
            <Button type="submit" fullWidth>Registrarme</Button>
          </div>
        </form>
      </div>
    
  );
}
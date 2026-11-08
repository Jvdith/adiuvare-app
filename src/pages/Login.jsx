import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { validateLogin } from '../services/userService';

export default function Login() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('voluntario');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);


    const result = await validateLogin(email, password);

    setLoading(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    navigate('/home');
  };

  return (

    <div className="page-content">
      <button className="header-back" onClick={() => navigate('/')}>←</button>

      <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '30px', fontSize: '20px' }}>
        ¡Hola de nuevo!<br />Inicia sesión para continuar
      </h2>


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

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="example@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres..."
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {serverError && (
          <div role="alert" aria-live="assertive" style={{ margin: '8px 0' }}>
            <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{serverError}</p>
          </div>
        )}

        <div style={{ width: '80%', margin: '20px auto 0 auto' }}>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </div>
      </form>
    </div>

  );
}
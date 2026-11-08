import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { getCurrentUser, updateCurrentUser, updateAvatar, logout } from '../services/userService';
import Button from '../components/Button';
import Input from '../components/Input';
import BottomNav from '../components/BottomNav';
import avatarDefault from '../assets/generic_avatar.svg';
import edit from '../assets/edit.svg';
import edit_white from '../assets/edit_white.svg';

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.nombre || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef(null);

  const isLight = theme === 'light';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!editName.trim() || !editEmail.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setError('Formato de email no válido');
      return;
    }

    const updated = updateCurrentUser({ nombre: editName.trim(), email: editEmail.trim() });
    setUser(updated);
    setError('');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user?.nombre || '');
    setEditEmail(user?.email || '');
    setError('');
    setIsEditing(false);
  };

  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');

   
    if (!file.type.startsWith('image/')) {
      setAvatarError('Debe ser una imagen');
      return;
    }

    
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('La imagen no puede superar 2 MB');
      return;
    }

    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const updated = updateAvatar(base64);
      setUser(updated);
    };
    reader.onerror = () => setAvatarError('Error al leer la imagen');
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="page-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>No has iniciado sesión</p>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Button onClick={() => navigate('/login')}>Ir al login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button className="header-back" onClick={() => navigate('/home')} style={{ marginBottom: 0 }}>←</button>
        <h3 style={{ flex: 1, textAlign: 'center', marginRight: '24px' }}>Mi Perfil</h3>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        
        <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 10px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={user.avatar || avatarDefault}
              alt="Foto de perfil"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

         
          <button
            onClick={handleAvatarClick}
            aria-label="Cambiar foto de perfil"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              border: '2px solid var(--bg-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>

         
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        </div>

        {avatarError && (
          <p role="alert" style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '8px' }}>
            {avatarError}
          </p>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} style={{ marginTop: '15px' }}>
            <Input label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            <Input label="Correo electrónico" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required error={error} />
            <div style={{ width: '80%', margin: '15px auto 0 auto', display: 'flex', gap: '10px' }}>
              <Button type="button" variant="secondary" fullWidth onClick={handleCancelEdit}>Cancelar</Button>
              <Button type="submit" variant="success" fullWidth>Guardar</Button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontWeight: 'bold', color: 'var(--text-color)', fontSize: '16px' }}>{user.nombre}</p>
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Editar datos del perfil"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <img src={isLight ? edit : edit_white} alt="" aria-hidden="true" style={{ width: '18px', height: '18px', display: 'block' }} />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-color)' }}>
        <Link to="/my-inscriptions" style={{ color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'block' }}>
          Mis inscripciones
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <span>Modo Oscuro</span>
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
        </div>
        <Link to="/help" style={{ color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'block' }}>
          Ayuda y Contacto
        </Link>
      </div>

      <div style={{ width: '80%', margin: '30px auto 20px auto' }}>
        <Button variant="danger" fullWidth onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
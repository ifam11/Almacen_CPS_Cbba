/**
 * @file LoginModal.jsx
 * @description Modal de acceso para personal administrativo y gerencial de la CPS.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

const LoginModal = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('gerencia@cps.gob.bo');
  const [password, setPassword] = useState('Admin123*');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'gerencia') {
      setEmail('gerencia@cps.gob.bo');
      setPassword('Admin123*');
    } else {
      setEmail('admin@cps.gob.bo');
      setPassword('Admin123*');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 43, 73, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(6px)'
    }}>
      <div className="glass-card" style={{
        maxWidth: '440px',
        width: '90%',
        padding: '32px',
        backgroundColor: '#FFFFFF',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: 'var(--cps-navy)',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            ✚
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--cps-navy)', margin: 0 }}>
            CAJA PETROLERA DE SALUD
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Portal Gerencial • Almacén Central
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #F87171',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#B91C1C',
            fontSize: '12px',
            marginBottom: '16px'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Correo Institucional
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px', backgroundColor: '#F8FAFC' }}>
              <Mail size={16} color="#94A3B8" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '10px 8px', fontSize: '13px', outline: 'none' }}
                placeholder="usuario@cps.gob.bo"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Contraseña
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px', backgroundColor: '#F8FAFC' }}>
              <Lock size={16} color="#94A3B8" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '10px 8px', fontSize: '13px', outline: 'none' }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            disabled={loading}
          >
            {loading ? 'Validando credenciales...' : 'INGRESAR AL DASHBOARD'}
          </button>
        </form>

        {/* Accesos Rápidos para Demostración */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Acceso Rápido de Prueba:
          </span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '11px', padding: '6px 10px' }}
              onClick={() => handleQuickLogin('gerencia')}
            >
              👩‍⚕️ Dra. Prado (Gerencia)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '11px', padding: '6px 10px' }}
              onClick={() => handleQuickLogin('admin')}
            >
              🛡️ Admin Central
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

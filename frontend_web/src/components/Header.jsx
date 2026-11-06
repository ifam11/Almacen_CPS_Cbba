/**
 * @file Header.jsx
 * @description Barra superior institucional para el Dashboard Web de la Caja Petrolera de Salud.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, RefreshCw, Bell, User } from 'lucide-react';

const Header = ({ onRefresh, loading }) => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-BO'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('es-BO'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{
      backgroundColor: 'var(--cps-navy)',
      color: '#FFFFFF',
      borderBottom: '3px solid var(--cps-blue)',
      padding: '16px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Logotipo y Título Institucional */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{ fontSize: '26px', color: 'var(--cps-navy)', fontWeight: '900' }}>✚</span>
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', margin: 0 }}>
            CAJA PETROLERA DE SALUD
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--cps-blue-light)', margin: 0, fontWeight: '500' }}>
            Almacén Central • Dashboard Gerencial, Trazabilidad y Alertas FEFO
          </p>
        </div>
      </div>

      {/* Reloj y Acciones */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Reloj en vivo */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#E0F2FE'
        }}>
          🇧🇴 La Paz: {time}
        </div>

        {/* Botón Refrescar Métricas */}
        <button
          onClick={onRefresh}
          className="btn btn-outline"
          disabled={loading}
          style={{
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            padding: '8px 14px',
            fontSize: '12px'
          }}
          title="Actualizar datos en tiempo real"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>

        {/* Perfil del Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '18px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--cps-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 'bold'
          }}>
            <User size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>
              {user?.nombre_completo || 'Usuario Autorizado'}
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: 'var(--cps-blue-light)',
              textTransform: 'uppercase'
            }}>
              ROL: {user?.rol || 'GERENTE'}
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F87171',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '6px'
            }}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

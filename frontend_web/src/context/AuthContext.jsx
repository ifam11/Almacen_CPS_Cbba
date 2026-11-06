/**
 * @file AuthContext.jsx
 * @description Contexto de autenticación para gerentes y administradores en Frontend Web.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cps_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cps_auth_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success) {
        const { token: jwtToken, usuario } = response.data;
        setToken(jwtToken);
        setUser(usuario);
        localStorage.setItem('cps_auth_token', jwtToken);
        localStorage.setItem('cps_user', JSON.stringify(usuario));
        return { success: true };
      }
      throw new Error(response.message || 'Error al iniciar sesión');
    } catch (err) {
      return { success: false, message: err.message || 'Credenciales inválidas' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cps_auth_token');
    localStorage.removeItem('cps_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

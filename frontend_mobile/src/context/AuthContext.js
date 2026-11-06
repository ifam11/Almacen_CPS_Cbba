/**
 * @file AuthContext.js
 * @description Proveedor de estado global de autenticación para la app móvil de operarios.
 */

import React, { createContext, useState, useContext } from 'react';
import api, { setAuthToken } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { token: jwtToken, usuario } = response.data.data;
        setToken(jwtToken);
        setUser(usuario);
        setAuthToken(jwtToken);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Error al autenticar');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Fallo de conexión con el servidor CPS';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

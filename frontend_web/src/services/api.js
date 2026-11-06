/**
 * @file api.js
 * @description Cliente Axios para la aplicación web administrativa de CPS.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cps_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para manejar sesiones expiradas (401)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cps_auth_token');
      localStorage.removeItem('cps_user');
      // Redirigir o emitir evento de logout si es necesario
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;

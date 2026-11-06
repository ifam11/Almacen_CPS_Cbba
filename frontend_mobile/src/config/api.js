/**
 * @file api.js
 * @description Cliente HTTP Axios configurado para la API RESTful de Almacén CPS.
 */

import axios from 'axios';
import { Platform } from 'react-native';

// En emulador Android '10.0.2.2' mapea al localhost de la máquina host.
// Para dispositivo físico en misma red WiFi se puede configurar la IP local de la PC.
export const BASE_API_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api/v1',
  ios: 'http://localhost:5000/api/v1',
  default: 'http://localhost:5000/api/v1'
});

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;

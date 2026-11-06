/**
 * @file jwt.js
 * @description Parámetros y utilidades de configuración de seguridad JWT.
 */

const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  secret: process.env.JWT_SECRET || 'cps_secret_secure_key_inventarios_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  algorithm: 'HS256'
};

/**
 * @file auth.controller.js
 * @description Controlador para endpoints de autenticación y sesión.
 */

const authService = require('./auth.service');
const ResponseHandler = require('../../utils/responseHandler');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Desconocido';

      const resultado = await authService.login(email, password, ip, userAgent);

      return ResponseHandler.success(res, resultado, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const perfil = await authService.getProfile(req.user.id_usuario);
      return ResponseHandler.success(res, perfil, 'Perfil de usuario obtenido');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

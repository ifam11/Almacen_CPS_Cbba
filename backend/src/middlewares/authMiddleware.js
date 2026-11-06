/**
 * @file authMiddleware.js
 * @description Middleware de autenticación mediante JWT con validación de estado activo del usuario.
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { Usuario, Rol } = require('../models');
const ResponseHandler = require('../utils/responseHandler');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseHandler.unauthorized(res, 'Encabezado de autorización ausente o con formato inválido (Bearer <token>)');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return ResponseHandler.unauthorized(res, 'Token de autenticación no suministrado');
    }

    // Verificación criptográfica del token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtConfig.secret);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return ResponseHandler.unauthorized(res, 'La sesión ha expirado. Por favor inicie sesión nuevamente.');
      }
      return ResponseHandler.unauthorized(res, 'Token inválido o manipulado.');
    }

    // Consulta de usuario en BD para asegurar que no fue suspendido o eliminado
    const usuario = await Usuario.findByPk(decoded.id_usuario, {
      include: [{ model: Rol, as: 'rol', attributes: ['id_rol', 'nombre'] }]
    });

    if (!usuario) {
      return ResponseHandler.unauthorized(res, 'El usuario asociado a este token ya no existe en el sistema.');
    }

    if (!usuario.activo) {
      return ResponseHandler.forbidden(res, 'Usuario suspendido temporalmente. Contacte al Administrador.');
    }

    // Adjuntar usuario autenticado a la petición
    req.user = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      nombre_completo: usuario.nombre_completo,
      id_rol: usuario.id_rol,
      rol: usuario.rol ? usuario.rol.nombre : null
    };

    next();
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE_ERROR]:', error);
    return ResponseHandler.serverError(res, 'Fallo inesperado durante la validación de credenciales.');
  }
};

module.exports = authenticateToken;

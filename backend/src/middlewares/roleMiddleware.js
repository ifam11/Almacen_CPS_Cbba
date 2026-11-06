/**
 * @file roleMiddleware.js
 * @description Middleware RBAC (Role-Based Access Control) para control granular de permisos por ruta.
 * Roles soportados: Administrador, Gerente, Encargado, Operario, Solicitante.
 */

const ResponseHandler = require('../utils/responseHandler');

/**
 * Middleware factory para autorizar uno o múltiples roles
 * @param {string|string[]} rolesPermitidos - Rol o arreglo de roles autorizados
 */
const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return ResponseHandler.unauthorized(res, 'Autenticación requerida para acceder a este recurso.');
    }

    const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];

    // Administrador siempre tiene pase maestro en el sistema hospitalario
    if (req.user.rol === 'Administrador' || roles.includes(req.user.rol)) {
      return next();
    }

    return ResponseHandler.forbidden(
      res,
      `Acceso Denegado (RBAC): El rol [${req.user.rol}] no posee autorización para ejecutar esta acción. Roles requeridos: [${roles.join(', ')}].`
    );
  };
};

module.exports = {
  checkRole
};

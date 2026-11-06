/**
 * @file errorHandler.js
 * @description Middleware centralizado para captura y formateo de excepciones en toda la API.
 * Garantiza el formato unificado: { success: false, data: object, message: string }
 */

const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('[UNHANDLED_EXCEPTION]:', err);

  // Errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({ campo: e.path, mensaje: e.message }));
    return ResponseHandler.badRequest(res, 'Error de validación en los datos suministrados', { errors });
  }

  // Errores de clave única duplicada en Sequelize / MySQL
  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = err.errors ? err.errors.map(e => e.path).join(', ') : 'campo único';
    return ResponseHandler.conflict(res, `Conflicto de unicidad: Ya existe un registro con el mismo ${fields}.`);
  }

  // Errores de clave foránea
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return ResponseHandler.badRequest(res, 'Operación rechazada: La referencia foránea indicada no existe o tiene dependencias activas.');
  }

  // Error de sintaxis JSON en el cuerpo de la petición
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ResponseHandler.badRequest(res, 'El cuerpo de la petición contiene un formato JSON inválido.');
  }

  // Errores operacionales personalizados con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      data: err.data || {},
      message: err.message || 'Error operacional'
    });
  }

  // Error genérico del servidor
  return ResponseHandler.serverError(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error interno en el servidor.'
  );
};

module.exports = errorHandler;

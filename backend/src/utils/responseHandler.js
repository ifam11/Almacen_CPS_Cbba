/**
 * @file responseHandler.js
 * @description Utilidad centralizada para estandarizar todas las respuestas de la API.
 * Formato estricto requerido: { success: boolean, data: object, message: string }
 */

class ResponseHandler {
  /**
   * Respuesta exitosa genérica (200 OK)
   */
  static success(res, data = {}, message = 'Operación realizada con éxito', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data: data || {},
      message: message
    });
  }

  /**
   * Recurso creado exitosamente (201 Created)
   */
  static created(res, data = {}, message = 'Recurso creado correctamente') {
    return this.success(res, data, message, 201);
  }

  /**
   * Error de cliente / Validación (400 Bad Request)
   */
  static badRequest(res, message = 'Parámetros inválidos en la solicitud', data = {}) {
    return res.status(400).json({
      success: false,
      data: data || {},
      message: message
    });
  }

  /**
   * No autenticado (401 Unauthorized)
   */
  static unauthorized(res, message = 'Credenciales no proporcionadas o inválidas', data = {}) {
    return res.status(401).json({
      success: false,
      data: data || {},
      message: message
    });
  }

  /**
   * Prohibido / Sin permisos RBAC o Violación de Regla FEFO/FIFO (403 Forbidden)
   */
  static forbidden(res, message = 'Acceso no autorizado o acción bloqueada por reglas de negocio', data = {}) {
    return res.status(403).json({
      success: false,
      data: data || {},
      message: message
    });
  }

  /**
   * Recurso no encontrado (404 Not Found)
   */
  static notFound(res, message = 'El recurso solicitado no fue encontrado', data = {}) {
    return res.status(404).json({
      success: false,
      data: data || {},
      message: message
    });
  }

  /**
   * Conflicto de estado (409 Conflict)
   */
  static conflict(res, message = 'Existe un conflicto con el estado actual del recurso', data = {}) {
    return res.status(409).json({
      success: false,
      data: data || {},
      message: message
    });
  }

  /**
   * Error interno del servidor (500 Internal Server Error)
   */
  static serverError(res, message = 'Error interno del servidor', data = {}) {
    return res.status(500).json({
      success: false,
      data: data || {},
      message: message
    });
  }
}

module.exports = ResponseHandler;

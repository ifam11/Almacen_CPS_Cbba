/**
 * @file audit.controller.js
 * @description Controlador para visualización y consulta de bitácora de auditoría.
 */

const auditService = require('./audit.service');
const ResponseHandler = require('../../utils/responseHandler');

class AuditController {
  async getAuditLogs(req, res, next) {
    try {
      const logs = await auditService.getAuditLogs(req.query);
      return ResponseHandler.success(res, logs, 'Registros de auditoría obtenidos');
    } catch (error) {
      next(error);
    }
  }

  async getAuditById(req, res, next) {
    try {
      const log = await auditService.getAuditById(req.params.id);
      return ResponseHandler.success(res, log, 'Detalle de auditoría obtenido');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuditController();

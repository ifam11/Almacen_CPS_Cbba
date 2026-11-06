/**
 * @file dashboard.controller.js
 * @description Controlador HTTP para métricas gerenciales y alertas de inventario.
 */

const dashboardService = require('./dashboard.service');
const ResponseHandler = require('../../utils/responseHandler');

class DashboardController {
  async getMetrics(req, res, next) {
    try {
      const data = await dashboardService.getMetricsConsolidated();
      return ResponseHandler.success(res, data, 'Métricas consolidadas de almacén obtenidas');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();

/**
 * @file reception.controller.js
 * @description Controlador HTTP para endpoints de recepción de lotes y emisión de QR.
 */

const receptionService = require('./reception.service');
const ResponseHandler = require('../../utils/responseHandler');

class ReceptionController {
  async registrarIngreso(req, res, next) {
    try {
      const data = await receptionService.registrarIngresoMercancia(req.body, req.user.id_usuario);
      
      // Metadata para la bitácora de auditoría automática
      res.locals.auditLog = {
        accion: 'RECEPCION_MERCANCIA_LOTES',
        tabla_afectada: 'lotes',
        registro_id: data.lotes.map(l => l.id_lote).join(', '),
        valores_nuevos: {
          proveedor: data.proveedor,
          total_lotes: data.total_lotes_recibidos,
          lotes: data.lotes.map(l => ({ id_lote: l.id_lote, numero_lote: l.numero_lote, cantidad: l.cantidad_ingresada }))
        }
      };

      return ResponseHandler.created(res, data, 'Ingreso de lotes registrado satisfactoriamente en inventario y Kardex');
    } catch (error) {
      next(error);
    }
  }

  async getLotes(req, res, next) {
    try {
      const data = await receptionService.getLotes(req.query);
      return ResponseHandler.success(res, data, 'Listado de lotes obtenido');
    } catch (error) {
      next(error);
    }
  }

  async getLoteByQr(req, res, next) {
    try {
      const lote = await receptionService.getLoteByQr(req.params.codigo_qr);
      return ResponseHandler.success(res, lote, 'Lote localizado mediante código QR');
    } catch (error) {
      next(error);
    }
  }

  async reimprimirQrLote(req, res, next) {
    try {
      const data = await receptionService.reimprimirQrLote(req.params.id);
      return ResponseHandler.success(res, data, 'Etiqueta QR generada para reimpresión');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReceptionController();

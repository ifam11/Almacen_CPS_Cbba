/**
 * @file dispatch.controller.js
 * @description Controlador HTTP para operaciones de despacho móvil y consulta de Kardex.
 */

const dispatchService = require('./dispatch.service');
const ResponseHandler = require('../../utils/responseHandler');

class DispatchController {
  /**
   * Ejecuta el despacho de inventario por QR con validación FEFO/FIFO
   */
  async ejecutarDespacho(req, res, next) {
    try {
      const idUsuario = req.user?.id_usuario || req.body.id_usuario || 1;
      const resultado = await dispatchService.ejecutarDespachoLote(req.body, idUsuario);

      // Metadatos para la bitácora de auditoría inmutable
      res.locals.auditLog = {
        accion: 'DESPACHO_INVENTARIO',
        tabla_afectada: 'movimiento_kardex',
        registro_id: String(resultado.kardex.id_movimiento),
        valores_nuevos: {
          insumo: resultado.insumo.nombre,
          lote: resultado.lote.numero_lote,
          cantidad_despachada: resultado.lote.cantidad_despachada,
          saldo_restante: resultado.lote.saldo_restante_lote
        }
      };

      return ResponseHandler.success(res, resultado, 'Despacho procesado y registrado en Kardex exitosamente');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Módulo de Escaneo QR (React Native a Node.js)
   * GET /api/lote/escanear/:codigoQR
   */
  async escanearLote(req, res, next) {
    try {
      const codigoQr = req.params.codigoQR || req.params.codigo_qr;
      const data = await dispatchService.escanearLoteQr(codigoQr);
      return ResponseHandler.success(res, data, 'Lectura de código QR exitosa');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Consulta el lote que el operario debe retirar según FEFO/FIFO
   */
  async getLoteSugerido(req, res, next) {
    try {
      const sugerencia = await dispatchService.obtenerLoteSugerido(req.params.id_insumo);
      return ResponseHandler.success(res, sugerencia, 'Lote prioritario sugerido para despacho');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Consulta el historial inmutable de movimientos de Kardex
   */
  async getKardexByInsumo(req, res, next) {
    try {
      const kardex = await dispatchService.getKardexByInsumo(req.params.id_insumo, req.query);
      return ResponseHandler.success(res, kardex, 'Movimientos de Kardex obtenidos');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DispatchController();

/**
 * @file ai.controller.js
 * @description Controlador HTTP para endpoints de Inteligencia Artificial y pronóstico de demanda (SIGMAT CPS).
 */

const aiService = require('./ai.service');
const ResponseHandler = require('../../utils/responseHandler');

class AIController {
  /**
   * Obtiene la lista completa de predicciones de demanda y ROP (+15% SS) para todo el catálogo
   * GET /api/v1/ia/predicciones
   */
  async getPredicciones(req, res, next) {
    try {
      const predicciones = await aiService.getPrediccionesCompletas();
      return ResponseHandler.success(res, predicciones, 'Predicciones de demanda obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene la predicción detallada de un insumo específico
   * GET /api/v1/ia/prediccion/:id_insumo
   */
  async getPrediccionInsumo(req, res, next) {
    try {
      const { id_insumo } = req.params;
      const resultado = await aiService.predecirDemandaInsumo(id_insumo, req.query);
      return ResponseHandler.success(res, resultado, 'Detalle predictivo del insumo obtenido con éxito');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ejecuta la predicción de demanda mensual y cálculo de ROP para un insumo (POST)
   * POST /api/v1/ia/predecir-demanda/:id_insumo
   */
  async predecirDemanda(req, res, next) {
    try {
      const { id_insumo } = req.params;
      const resultado = await aiService.predecirDemandaInsumo(id_insumo, req.body);
      return ResponseHandler.success(res, resultado, 'Predicción de demanda y cálculo de ROP completado con éxito');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ejecuta el análisis predictivo global de inventario sobre todo el catálogo
   * GET /api/v1/ia/reorden-global
   */
  async analizarReordenGlobal(req, res, next) {
    try {
      const reporte = await aiService.analizarReordenGlobal();
      return ResponseHandler.success(res, reporte, 'Reporte predictivo de reorden global generado');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene los KPIs ejecutivos del modelo de Machine Learning
   * GET /api/v1/ia/kpis
   */
  async getKpis(req, res, next) {
    try {
      const kpis = await aiService.getKpis();
      return ResponseHandler.success(res, kpis, 'KPIs ejecutivos de IA obtenidos');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aplica un nuevo ROP a un insumo específico en la BD
   * POST /api/v1/ia/aplicar-rop/:id_insumo
   */
  async aplicarRop(req, res, next) {
    try {
      const { id_insumo } = req.params;
      const { punto_reorden } = req.body;
      const resultado = await aiService.aplicarRopInsumo(id_insumo, punto_reorden);
      return ResponseHandler.success(res, resultado, 'Punto de reorden actualizado en MySQL con éxito');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aplica masivamente los ROPs sugeridos por IA
   * POST /api/v1/ia/aplicar-rop-masivo
   */
  async aplicarRopMasivo(req, res, next) {
    try {
      const resultado = await aiService.aplicarRopMasivo();
      return ResponseHandler.success(res, resultado, 'Ajuste masivo de ROP ejecutado en MySQL');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Re-entrena el modelo Random Forest con Scikit-Learn
   * POST /api/v1/ia/re-entrenar
   */
  async reentrenar(req, res, next) {
    try {
      const resultado = await aiService.reentrenar();
      return ResponseHandler.success(res, resultado, 'Modelo Random Forest re-entrenado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();

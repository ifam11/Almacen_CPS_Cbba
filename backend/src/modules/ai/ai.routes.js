/**
 * @file ai.routes.js
 * @description Rutas para el módulo de Inteligencia Artificial y Machine Learning (SIGMAT CPS).
 */

const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');
const authenticateToken = require('../../middlewares/authMiddleware');

// Middleware opcional de autenticación para permitir consultas directas del app móvil y dashboard
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
};

router.use(optionalAuth);

// 1. Predicciones completas y KPIs
router.get('/predicciones', aiController.getPredicciones);
router.get('/kpis', aiController.getKpis);
router.get('/reorden-global', aiController.analizarReordenGlobal);

// 2. Predicción individual detallada
router.get('/prediccion/:id_insumo', aiController.getPrediccionInsumo);
router.post('/predecir-demanda/:id_insumo', aiController.predecirDemanda);

// 3. Operaciones de Re-entrenamiento y Aplicación de ROP
router.post('/re-entrenar', aiController.reentrenar);
router.post('/aplicar-rop/:id_insumo', aiController.aplicarRop);
router.post('/aplicar-rop-masivo', aiController.aplicarRopMasivo);

module.exports = router;

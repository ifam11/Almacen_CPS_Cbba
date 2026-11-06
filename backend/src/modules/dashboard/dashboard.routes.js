/**
 * @file dashboard.routes.js
 * @description Rutas para métricas gerenciales, valorización del almacén y alertas semafóricas.
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

router.use(authenticateToken);

// Dashboard gerencial y semáforo (Disponible para Gerencia, Administración y Encargados)
router.get('/metricas', checkRole(['Administrador', 'Gerente', 'Encargado']), dashboardController.getMetrics);

module.exports = router;

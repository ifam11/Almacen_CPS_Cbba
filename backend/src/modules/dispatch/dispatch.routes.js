/**
 * @file dispatch.routes.js
 * @description Rutas para despacho de mercancía en pasillo y consulta de Kardex.
 */

const express = require('express');
const router = express.Router();
const dispatchController = require('./dispatch.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

router.use(authenticateToken);

// Despacho de mercancía (Permitido para Operario de pasillo, Encargado y Administrador)
router.post('/', checkRole(['Administrador', 'Encargado', 'Operario']), dispatchController.ejecutarDespacho);

// Consulta de lote sugerido por FEFO/FIFO antes de picking físico
router.get('/sugerido/:id_insumo', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario']), dispatchController.getLoteSugerido);

// Historial de movimientos de Kardex por insumo
router.get('/kardex/:id_insumo', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario']), dispatchController.getKardexByInsumo);

module.exports = router;

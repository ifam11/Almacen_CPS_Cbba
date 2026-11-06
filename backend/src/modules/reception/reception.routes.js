/**
 * @file reception.routes.js
 * @description Rutas para la recepción de mercancía, consulta de lotes y emisión de QR.
 */

const express = require('express');
const router = express.Router();
const receptionController = require('./reception.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

router.use(authenticateToken);

// Registro transaccional de ingresos por lote (Encargado y Administrador)
router.post('/ingreso', checkRole(['Administrador', 'Encargado']), receptionController.registrarIngreso);

// Consulta de lotes generales
router.get('/lotes', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario']), receptionController.getLotes);

// Consulta por escaneo de Código QR (Crucial para operarios en pasillo)
router.get('/qr/:codigo_qr', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario']), receptionController.getLoteByQr);

// Reimpresión de etiqueta QR para un lote
router.get('/reimprimir/:id', checkRole(['Administrador', 'Encargado']), receptionController.reimprimirQrLote);

module.exports = router;

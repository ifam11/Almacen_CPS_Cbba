/**
 * @file audit.routes.js
 * @description Rutas de consulta forense de la bitácora de auditoría inmutable (RBAC: Administrador y Gerente).
 */

const express = require('express');
const router = express.Router();
const auditController = require('./audit.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

router.use(authenticateToken);
router.use(checkRole(['Administrador', 'Gerente']));

// Endpoints de solo lectura (la bitácora no admite modificaciones manuales ni eliminaciones)
router.get('/', auditController.getAuditLogs);
router.get('/:id', auditController.getAuditById);

module.exports = router;

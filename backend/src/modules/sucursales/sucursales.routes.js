/**
 * @file sucursales.routes.js
 * @description Rutas HTTP para el CRUD de Sucursales de la CPS Regional Cochabamba.
 */

const { Router } = require('express');
const sucursalesController = require('./sucursales.controller');
const { verifyToken, checkRole } = require('../../middlewares/authMiddleware');

const router = Router();

// Rutas públicas o protegidas según política
router.get('/', sucursalesController.getAll);
router.get('/:id', sucursalesController.getById);

// Rutas de administración (crear, editar, eliminar)
router.post('/', sucursalesController.create);
router.put('/:id', sucursalesController.update);
router.delete('/:id', sucursalesController.delete);

module.exports = router;

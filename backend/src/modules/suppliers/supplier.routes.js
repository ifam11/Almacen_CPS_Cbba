/**
 * @file supplier.routes.js
 * @description Rutas para la gestión de proveedores con protección JWT y control RBAC.
 */

const express = require('express');
const router = express.Router();
const supplierController = require('./supplier.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

router.use(authenticateToken);

// Consulta disponible para Administrador, Gerente, Encargado y Operario
router.get('/', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario']), supplierController.getAllSuppliers);
router.get('/:id', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario']), supplierController.getSupplierById);

// Operaciones de mutación: Encargado y Administrador
router.post('/', checkRole(['Administrador', 'Encargado']), supplierController.createSupplier);
router.put('/:id', checkRole(['Administrador', 'Encargado']), supplierController.updateSupplier);
router.delete('/:id', checkRole(['Administrador', 'Encargado']), supplierController.deleteSupplier);

module.exports = router;

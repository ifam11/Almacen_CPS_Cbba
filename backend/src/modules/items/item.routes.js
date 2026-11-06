/**
 * @file item.routes.js
 * @description Rutas para catálogo de insumos médicos y administrativos.
 */

const express = require('express');
const router = express.Router();
const itemController = require('./item.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

router.use(authenticateToken);

// Consulta disponible para todos los roles del sistema hospitalario
router.get('/', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario', 'Solicitante']), itemController.getAllItems);
router.get('/:id', checkRole(['Administrador', 'Gerente', 'Encargado', 'Operario', 'Solicitante']), itemController.getItemById);

// Gestión exclusiva para Encargado de Almacén y Administrador
router.post('/', checkRole(['Administrador', 'Encargado']), itemController.createItem);
router.put('/:id', checkRole(['Administrador', 'Encargado']), itemController.updateItem);
router.delete('/:id', checkRole(['Administrador', 'Encargado']), itemController.deleteItem);

module.exports = router;

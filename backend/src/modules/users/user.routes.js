/**
 * @file user.routes.js
 * @description Rutas de gestión de usuarios con protección estricta por token y roles RBAC.
 */

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authenticateToken = require('../../middlewares/authMiddleware');
const { checkRole } = require('../../middlewares/roleMiddleware');

// Middleware global de autenticación para todas las rutas de usuarios
router.use(authenticateToken);

// Listar roles disponibles en el sistema (Administrador, Gerente, Encargado)
router.get('/roles', checkRole(['Administrador', 'Gerente', 'Encargado']), userController.getAllRoles);

// CRUD de usuarios
router.get('/', checkRole(['Administrador', 'Gerente']), userController.getAllUsers);
router.get('/:id', checkRole(['Administrador', 'Gerente']), userController.getUserById);
router.post('/', checkRole('Administrador'), userController.createUser);
router.put('/:id', checkRole('Administrador'), userController.updateUser);
router.delete('/:id', checkRole('Administrador'), userController.deleteUser);

module.exports = router;

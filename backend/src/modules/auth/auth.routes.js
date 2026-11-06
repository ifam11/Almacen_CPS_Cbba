/**
 * @file auth.routes.js
 * @description Rutas para autenticación y consulta de perfil de usuario.
 */

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authenticateToken = require('../../middlewares/authMiddleware');

// Endpoint público: Login
router.post('/login', authController.login);

// Endpoint protegido: Perfil del usuario en sesión
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;

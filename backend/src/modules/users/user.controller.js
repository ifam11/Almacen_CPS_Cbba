/**
 * @file user.controller.js
 * @description Controlador HTTP para endpoints de usuarios y roles.
 */

const userService = require('./user.service');
const ResponseHandler = require('../../utils/responseHandler');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const usuarios = await userService.getAllUsers();
      return ResponseHandler.success(res, usuarios, 'Usuarios obtenidos con éxito');
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const usuario = await userService.getUserById(req.params.id);
      return ResponseHandler.success(res, usuario, 'Detalle de usuario obtenido');
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const nuevoUsuario = await userService.createUser(req.body);
      res.locals.createdId = nuevoUsuario.id_usuario;
      return ResponseHandler.created(res, nuevoUsuario, 'Usuario creado satisfactoriamente');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const usuarioActualizado = await userService.updateUser(req.params.id, req.body);
      return ResponseHandler.success(res, usuarioActualizado, 'Usuario actualizado satisfactoriamente');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const resultado = await userService.deleteUser(req.params.id);
      return ResponseHandler.success(res, resultado, 'Usuario dado de baja (borrado lógico)');
    } catch (error) {
      next(error);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const roles = await userService.getAllRoles();
      return ResponseHandler.success(res, roles, 'Roles RBAC listados');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

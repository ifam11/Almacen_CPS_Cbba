/**
 * @file item.controller.js
 * @description Controlador HTTP para catálogo de insumos y evaluación de stock.
 */

const itemService = require('./item.service');
const ResponseHandler = require('../../utils/responseHandler');

class ItemController {
  async getAllItems(req, res, next) {
    try {
      const data = await itemService.getAllItems(req.query);
      return ResponseHandler.success(res, data, 'Catálogo de insumos obtenido');
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const insumo = await itemService.getItemById(req.params.id);
      return ResponseHandler.success(res, insumo, 'Detalle de insumo obtenido');
    } catch (error) {
      next(error);
    }
  }

  async createItem(req, res, next) {
    try {
      const nuevo = await itemService.createItem(req.body);
      res.locals.createdId = nuevo.id_insumo;
      return ResponseHandler.created(res, nuevo, 'Insumo registrado en el catálogo exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const actualizado = await itemService.updateItem(req.params.id, req.body);
      return ResponseHandler.success(res, actualizado, 'Insumo actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const resultado = await itemService.deleteItem(req.params.id);
      return ResponseHandler.success(res, resultado, 'Insumo dado de baja (borrado lógico)');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ItemController();

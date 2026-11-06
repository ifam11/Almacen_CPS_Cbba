/**
 * @file supplier.controller.js
 * @description Controlador HTTP para endpoints de proveedores.
 */

const supplierService = require('./supplier.service');
const ResponseHandler = require('../../utils/responseHandler');

class SupplierController {
  async getAllSuppliers(req, res, next) {
    try {
      const data = await supplierService.getAllSuppliers(req.query);
      return ResponseHandler.success(res, data, 'Listado de proveedores obtenido');
    } catch (error) {
      next(error);
    }
  }

  async getSupplierById(req, res, next) {
    try {
      const proveedor = await supplierService.getSupplierById(req.params.id);
      return ResponseHandler.success(res, proveedor, 'Detalle de proveedor obtenido');
    } catch (error) {
      next(error);
    }
  }

  async createSupplier(req, res, next) {
    try {
      const nuevo = await supplierService.createSupplier(req.body);
      res.locals.createdId = nuevo.id_proveedor;
      return ResponseHandler.created(res, nuevo, 'Proveedor registrado satisfactoriamente');
    } catch (error) {
      next(error);
    }
  }

  async updateSupplier(req, res, next) {
    try {
      const actualizado = await supplierService.updateSupplier(req.params.id, req.body);
      return ResponseHandler.success(res, actualizado, 'Proveedor actualizado satisfactoriamente');
    } catch (error) {
      next(error);
    }
  }

  async deleteSupplier(req, res, next) {
    try {
      const resultado = await supplierService.deleteSupplier(req.params.id);
      return ResponseHandler.success(res, resultado, 'Proveedor dado de baja (borrado lógico)');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupplierController();

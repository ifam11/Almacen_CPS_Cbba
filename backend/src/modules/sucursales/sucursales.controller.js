/**
 * @file sucursales.controller.js
 * @description Controlador HTTP para el CRUD de Sucursales de la CPS Regional Cochabamba.
 */

const sucursalesService = require('./sucursales.service');
const ResponseHandler = require('../../utils/responseHandler');

class SucursalesController {
  async getAll(req, res, next) {
    try {
      const sucursales = await sucursalesService.getAllSucursales(req.query);
      return ResponseHandler.success(res, sucursales, 'Listado de sucursales obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const sucursal = await sucursalesService.getSucursalById(req.params.id);
      return ResponseHandler.success(res, sucursal, 'Sucursal obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const nuevaSucursal = await sucursalesService.createSucursal(req.body);

      res.locals.auditLog = {
        accion: 'CREAR_SUCURSAL',
        tabla_afectada: 'sucursales',
        registro_id: String(nuevaSucursal.id_sucursal),
        valores_nuevos: req.body
      };

      return ResponseHandler.created(res, nuevaSucursal, 'Sucursal registrada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const sucursalActualizada = await sucursalesService.updateSucursal(req.params.id, req.body);

      res.locals.auditLog = {
        accion: 'ACTUALIZAR_SUCURSAL',
        tabla_afectada: 'sucursales',
        registro_id: String(req.params.id),
        valores_nuevos: req.body
      };

      return ResponseHandler.success(res, sucursalActualizada, 'Sucursal actualizada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const resultado = await sucursalesService.deleteSucursal(req.params.id);

      res.locals.auditLog = {
        accion: 'ELIMINAR_SUCURSAL',
        tabla_afectada: 'sucursales',
        registro_id: String(req.params.id),
        valores_nuevos: { estado: 'ELIMINADO' }
      };

      return ResponseHandler.success(res, resultado, 'Sucursal eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SucursalesController();

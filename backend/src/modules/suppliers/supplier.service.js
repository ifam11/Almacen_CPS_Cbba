/**
 * @file supplier.service.js
 * @description Lógica de negocio para gestión de proveedores de insumos médicos y generales.
 */

const { Op } = require('sequelize');
const { Proveedor, Lote } = require('../../models');

class SupplierService {
  /**
   * Listar proveedores con búsqueda opcional y filtros
   */
  async getAllSuppliers(query = {}) {
    const { busqueda, activo, pagina = 1, limite = 50 } = query;
    const where = {};

    if (activo !== undefined) {
      where.activo = activo === 'true' || activo === true;
    }

    if (busqueda) {
      where[Op.or] = [
        { razon_social: { [Op.like]: `%${busqueda}%` } },
        { nit_rut: { [Op.like]: `%${busqueda}%` } },
        { contacto_nombre: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const limit = Math.min(parseInt(limite, 10) || 50, 100);
    const offset = ((parseInt(pagina, 10) || 1) - 1) * limit;

    const { count, rows } = await Proveedor.findAndCountAll({
      where,
      order: [['razon_social', 'ASC']],
      limit,
      offset
    });

    return {
      total: count,
      pagina: parseInt(pagina, 10) || 1,
      total_paginas: Math.ceil(count / limit),
      limite: limit,
      proveedores: rows
    };
  }

  /**
   * Obtener detalle de proveedor por ID
   */
  async getSupplierById(id) {
    const proveedor = await Proveedor.findByPk(id, {
      include: [
        {
          model: Lote,
          as: 'lotes',
          attributes: ['id_lote', 'numero_lote', 'cantidad_actual', 'fecha_vencimiento', 'estado'],
          limit: 10
        }
      ]
    });

    if (!proveedor) {
      const err = new Error(`Proveedor con ID ${id} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    return proveedor;
  }

  /**
   * Registrar nuevo proveedor con validación de NIT/RUT único
   */
  async createSupplier(data) {
    const { nit_rut, razon_social, contacto_nombre, telefono, email, direccion } = data;

    if (!nit_rut || !razon_social) {
      const err = new Error('Los campos nit_rut y razon_social son de carácter obligatorio.');
      err.statusCode = 400;
      throw err;
    }

    const existe = await Proveedor.findOne({ where: { nit_rut: nit_rut.trim() } });
    if (existe) {
      const err = new Error(`Ya existe un proveedor registrado con el NIT/RUT: ${nit_rut}`);
      err.statusCode = 409;
      throw err;
    }

    return await Proveedor.create({
      nit_rut: nit_rut.trim(),
      razon_social: razon_social.trim(),
      contacto_nombre: contacto_nombre ? contacto_nombre.trim() : null,
      telefono: telefono ? telefono.trim() : null,
      email: email ? email.trim().toLowerCase() : null,
      direccion: direccion ? direccion.trim() : null,
      activo: true
    });
  }

  /**
   * Actualizar datos del proveedor
   */
  async updateSupplier(id, data) {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      const err = new Error(`Proveedor con ID ${id} no encontrado para actualización.`);
      err.statusCode = 404;
      throw err;
    }

    if (data.nit_rut && data.nit_rut !== proveedor.nit_rut) {
      const nitExiste = await Proveedor.findOne({
        where: {
          nit_rut: data.nit_rut.trim(),
          id_proveedor: { [Op.ne]: id }
        }
      });
      if (nitExiste) {
        const err = new Error(`El NIT/RUT ${data.nit_rut} ya pertenece a otro proveedor.`);
        err.statusCode = 409;
        throw err;
      }
    }

    const updatePayload = {};
    if (data.nit_rut) updatePayload.nit_rut = data.nit_rut.trim();
    if (data.razon_social) updatePayload.razon_social = data.razon_social.trim();
    if (data.contacto_nombre !== undefined) updatePayload.contacto_nombre = data.contacto_nombre;
    if (data.telefono !== undefined) updatePayload.telefono = data.telefono;
    if (data.email !== undefined) updatePayload.email = data.email ? data.email.trim().toLowerCase() : null;
    if (data.direccion !== undefined) updatePayload.direccion = data.direccion;
    if (data.activo !== undefined) updatePayload.activo = data.activo;

    await proveedor.update(updatePayload);
    return proveedor;
  }

  /**
   * Baja lógica de proveedor (Soft Delete)
   */
  async deleteSupplier(id) {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      const err = new Error(`Proveedor con ID ${id} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    // Verificar si tiene lotes activos con existencia física
    const lotesActivos = await Lote.count({
      where: {
        id_proveedor: id,
        cantidad_actual: { [Op.gt]: 0 }
      }
    });

    if (lotesActivos > 0) {
      const err = new Error(`No se puede dar de baja al proveedor porque tiene ${lotesActivos} lotes con existencias activas en el almacén.`);
      err.statusCode = 400;
      throw err;
    }

    await proveedor.update({ activo: false });
    await proveedor.destroy();

    return { id_proveedor: id, eliminado: true };
  }
}

module.exports = new SupplierService();

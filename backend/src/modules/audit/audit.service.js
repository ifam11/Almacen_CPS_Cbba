/**
 * @file audit.service.js
 * @description Servicio para consulta forense de la bitácora de auditoría inmutable.
 */

const { Op } = require('sequelize');
const { BitacoraAuditoria, Usuario, Rol } = require('../../models');

class AuditService {
  /**
   * Obtener registros de auditoría con filtros y paginación
   */
  async getAuditLogs(filtros = {}) {
    const {
      pagina = 1,
      limite = 50,
      id_usuario,
      tabla_afectada,
      accion,
      fecha_inicio,
      fecha_fin
    } = filtros;

    const where = {};

    if (id_usuario) {
      where.id_usuario = id_usuario;
    }

    if (tabla_afectada) {
      where.tabla_afectada = tabla_afectada;
    }

    if (accion) {
      where.accion = accion;
    }

    if (fecha_inicio || fecha_fin) {
      where.fecha_hora = {};
      if (fecha_inicio) where.fecha_hora[Op.gte] = new Date(fecha_inicio);
      if (fecha_fin) where.fecha_hora[Op.lte] = new Date(fecha_fin);
    }

    const limit = Math.min(parseInt(limite, 10) || 50, 100);
    const offset = ((parseInt(pagina, 10) || 1) - 1) * limit;

    const { count, rows } = await BitacoraAuditoria.findAndCountAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre_completo', 'email'],
          include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
        }
      ],
      order: [['fecha_hora', 'DESC']],
      limit,
      offset
    });

    return {
      total: count,
      pagina: parseInt(pagina, 10) || 1,
      total_paginas: Math.ceil(count / limit),
      limite: limit,
      registros: rows
    };
  }

  /**
   * Obtener detalle de un evento de auditoría específico
   */
  async getAuditById(id) {
    const registro = await BitacoraAuditoria.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre_completo', 'email'],
          include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
        }
      ]
    });

    if (!registro) {
      const err = new Error('Registro de auditoría no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    return registro;
  }
}

module.exports = new AuditService();

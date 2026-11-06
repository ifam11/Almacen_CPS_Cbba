/**
 * @file item.service.js
 * @description Lógica de negocio para catálogo de insumos médicos (FEFO) y administrativos (FIFO).
 * El stock total se calcula dinámicamente sumando sus lotes activos; no se persiste en una sola columna.
 */

const { Op, fn, col, literal } = require('sequelize');
const { Insumo, Lote, Proveedor, sequelize } = require('../../models');

class ItemService {
  /**
   * Listar insumos con cálculo dinámico de stock disponible agregado desde la tabla Lotes
   */
  async getAllItems(query = {}) {
    const { busqueda, tipo, bajo_stock, pagina = 1, limite = 50, activo } = query;
    const where = {};

    if (activo !== undefined) {
      where.activo = activo === 'true' || activo === true;
    }

    if (tipo && ['SANITARIO', 'ADMINISTRATIVO'].includes(tipo.toUpperCase())) {
      where.tipo = tipo.toUpperCase();
    }

    if (busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { codigo_institucional: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const limit = Math.min(parseInt(limite, 10) || 50, 100);
    const offset = ((parseInt(pagina, 10) || 1) - 1) * limit;

    // Consulta con subconsulta o inclusión para totalizar existencias de lotes disponibles
    const insumos = await Insumo.findAll({
      where,
      attributes: {
        include: [
          [
            // Subconsulta SQL pura para sumar existencias atómicas por lotes en tiempo real
            literal(`(
              SELECT COALESCE(SUM(l.cantidad_actual), 0)
              FROM lotes AS l
              WHERE l.id_insumo = Insumo.id_insumo
                AND l.estado = 'DISPONIBLE'
                AND l.deleted_at IS NULL
            )`),
            'stock_actual'
          ],
          [
            literal(`(
              SELECT COUNT(l.id_lote)
              FROM lotes AS l
              WHERE l.id_insumo = Insumo.id_insumo
                AND l.estado = 'DISPONIBLE'
                AND l.cantidad_actual > 0
                AND l.deleted_at IS NULL
            )`),
            'total_lotes_activos'
          ]
        ]
      },
      order: [['nombre', 'ASC']],
      limit,
      offset
    });

    const total = await Insumo.count({ where });

    // Mapear resultados con indicador de estado de reorden
    let itemsFormateados = insumos.map(item => {
      const plain = item.get({ plain: true });
      const stockActual = parseInt(plain.stock_actual || 0, 10);
      const stockMinimo = plain.stock_minimo;
      const puntoReorden = plain.punto_reorden;

      let estadoStock = 'NORMAL';
      if (stockActual <= stockMinimo) {
        estadoStock = 'CRITICO';
      } else if (stockActual <= puntoReorden) {
        estadoStock = 'REORDEN';
      }

      return {
        ...plain,
        stock_actual: stockActual,
        total_lotes_activos: parseInt(plain.total_lotes_activos || 0, 10),
        alerta_stock: estadoStock
      };
    });

    if (bajo_stock === 'true') {
      itemsFormateados = itemsFormateados.filter(i => i.alerta_stock !== 'NORMAL');
    }

    return {
      total,
      pagina: parseInt(pagina, 10) || 1,
      total_paginas: Math.ceil(total / limit),
      limite,
      insumos: itemsFormateados
    };
  }

  /**
   * Obtener detalle de insumo con sus lotes vigentes ordenados por FEFO o FIFO
   */
  async getItemById(id) {
    const insumo = await Insumo.findByPk(id);
    if (!insumo) {
      const err = new Error(`Insumo con ID ${id} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    // Regla de ordenamiento: FEFO (vencimiento ascendente) para sanitarios, FIFO (ingreso ascendente) para administrativos
    const ordenLotes = insumo.tipo === 'SANITARIO'
      ? [['fecha_vencimiento', 'ASC'], ['id_lote', 'ASC']]
      : [['fecha_ingreso', 'ASC'], ['id_lote', 'ASC']];

    const lotes = await Lote.findAll({
      where: {
        id_insumo: id,
        deleted_at: null
      },
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['id_proveedor', 'razon_social', 'nit_rut'] }
      ],
      order: ordenLotes
    });

    const stockActual = lotes
      .filter(l => l.estado === 'DISPONIBLE')
      .reduce((acc, l) => acc + l.cantidad_actual, 0);

    const plainInsumo = insumo.get({ plain: true });

    return {
      ...plainInsumo,
      stock_actual: stockActual,
      criterio_despacho: insumo.tipo === 'SANITARIO' ? 'FEFO (First Expired, First Out)' : 'FIFO (First In, First Out)',
      lotes
    };
  }

  /**
   * Crear nuevo insumo en catálogo
   */
  async createItem(data) {
    const { codigo_institucional, nombre, descripcion, tipo, unidad_medida, stock_minimo, punto_reorden } = data;

    if (!codigo_institucional || !nombre || !tipo || !unidad_medida) {
      const err = new Error('Los campos codigo_institucional, nombre, tipo y unidad_medida son requeridos.');
      err.statusCode = 400;
      throw err;
    }

    if (!['SANITARIO', 'ADMINISTRATIVO'].includes(tipo.toUpperCase())) {
      const err = new Error("El tipo debe ser estrictamente 'SANITARIO' o 'ADMINISTRATIVO'.");
      err.statusCode = 400;
      throw err;
    }

    const existeCodigo = await Insumo.findOne({ where: { codigo_institucional: codigo_institucional.trim() } });
    if (existeCodigo) {
      const err = new Error(`El código institucional [${codigo_institucional}] ya está registrado.`);
      err.statusCode = 409;
      throw err;
    }

    return await Insumo.create({
      codigo_institucional: codigo_institucional.trim().toUpperCase(),
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      tipo: tipo.toUpperCase(),
      unidad_medida: unidad_medida.trim(),
      stock_minimo: parseInt(stock_minimo, 10) || 10,
      punto_reorden: parseInt(punto_reorden, 10) || 25,
      activo: true
    });
  }

  /**
   * Actualizar insumo
   */
  async updateItem(id, data) {
    const insumo = await Insumo.findByPk(id);
    if (!insumo) {
      const err = new Error(`Insumo con ID ${id} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    if (data.codigo_institucional && data.codigo_institucional !== insumo.codigo_institucional) {
      const codigoExiste = await Insumo.findOne({
        where: {
          codigo_institucional: data.codigo_institucional.trim().toUpperCase(),
          id_insumo: { [Op.ne]: id }
        }
      });
      if (codigoExiste) {
        const err = new Error(`El código institucional [${data.codigo_institucional}] ya pertenece a otro insumo.`);
        err.statusCode = 409;
        throw err;
      }
    }

    const updatePayload = {};
    if (data.codigo_institucional) updatePayload.codigo_institucional = data.codigo_institucional.trim().toUpperCase();
    if (data.nombre) updatePayload.nombre = data.nombre.trim();
    if (data.descripcion !== undefined) updatePayload.descripcion = data.descripcion;
    if (data.tipo && ['SANITARIO', 'ADMINISTRATIVO'].includes(data.tipo.toUpperCase())) {
      updatePayload.tipo = data.tipo.toUpperCase();
    }
    if (data.unidad_medida) updatePayload.unidad_medida = data.unidad_medida.trim();
    if (data.stock_minimo !== undefined) updatePayload.stock_minimo = parseInt(data.stock_minimo, 10);
    if (data.punto_reorden !== undefined) updatePayload.punto_reorden = parseInt(data.punto_reorden, 10);
    if (data.activo !== undefined) updatePayload.activo = data.activo;

    await insumo.update(updatePayload);
    return insumo;
  }

  /**
   * Eliminación lógica (Soft Delete)
   */
  async deleteItem(id) {
    const insumo = await Insumo.findByPk(id);
    if (!insumo) {
      const err = new Error(`Insumo con ID ${id} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    // Verificar si existen lotes con existencias físicas
    const totalExistencias = await Lote.sum('cantidad_actual', {
      where: {
        id_insumo: id,
        cantidad_actual: { [Op.gt]: 0 }
      }
    });

    if (totalExistencias > 0) {
      const err = new Error(`No se puede dar de baja el insumo porque aún cuenta con ${totalExistencias} unidades distribuidas en lotes activos.`);
      err.statusCode = 400;
      throw err;
    }

    await insumo.update({ activo: false });
    await insumo.destroy();

    return { id_insumo: id, eliminado: true };
  }
}

module.exports = new ItemService();

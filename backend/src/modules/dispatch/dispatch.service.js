/**
 * @file dispatch.service.js
 * @description Motor de Logística y Despacho con validación rigurosa de FEFO (Sanitarios) y FIFO (Administrativos).
 * Implementa transaccionalidad ACID, control de concurrencia y registro inmutable en Kardex.
 */

const { Op } = require('sequelize');
const dayjs = require('dayjs');
const {
  sequelize,
  Lote,
  Insumo,
  MovimientoKardex,
  SolicitudDespacho,
  DetalleSolicitud,
  Usuario,
  Proveedor
} = require('../../models');

class DispatchService {
  /**
   * =========================================================================
   * FUNCIÓN CRÍTICA DE REGLAS DE NEGOCIO: VALIDACIÓN FEFO Y FIFO
   * =========================================================================
   * 
   * @description
   * Evalúa si el lote seleccionado por el operario cumple con el principio de
   * rotación obligatorio según la naturaleza del insumo:
   * 
   * 1. REGLA FEFO (First Expired, First Out) - Insumos Sanitarios/Medicamentos:
   *    Obliga a despachar primero el lote con la FECHA DE VENCIMIENTO MÁS PRÓXIMA.
   *    Si el usuario intenta despachar un lote que vence después habiendo en stock
   *    otro lote con fecha de caducidad anterior, se aborta la transacción y se
   *    lanza un error HTTP 403 (Forbidden) con los detalles del lote prioritario.
   * 
   * 2. REGLA FIFO (First In, First Out) - Insumos Administrativos:
   *    Obliga a despachar primero el lote con la FECHA DE INGRESO MÁS ANTIGUA.
   *    Garantiza que el material de oficina o suministros no médicos roten en
   *    orden cronológico de recepción.
   * 
   * @param {Object} loteSeleccionado - Instancia del lote escaneado
   * @param {Object} insumo - Instancia del insumo al que pertenece el lote
   * @param {Object} transaction - Transacción activa de Sequelize (ACID)
   */
  async validarRotacionInventario(loteSeleccionado, insumo, transaction) {
    // Verificación flexible del dominio o tipo (Sanitario vs Administrativo)
    const esSanitario = (insumo.dominio && insumo.dominio.toLowerCase() === 'sanitario') ||
                        (insumo.tipo && insumo.tipo.toUpperCase() === 'SANITARIO');

    if (esSanitario) {
      // ---------------------------------------------------------------------
      // REGLA FEFO: Buscar el lote de este insumo con vencimiento más próximo
      // que tenga stock disponible (> 0) y no esté eliminado ni agotado.
      // ---------------------------------------------------------------------
      const lotePrioritarioFefo = await Lote.findOne({
        where: {
          id_insumo: insumo.id_insumo,
          estado: 'DISPONIBLE',
          cantidad_actual: { [Op.gt]: 0 },
          deleted_at: null
        },
        order: [
          ['fecha_vencimiento', 'ASC'], // Vencimiento más cercano primero
          ['id_lote', 'ASC']            // Desempate determinista
        ],
        transaction,
        lock: transaction.LOCK.SHARE
      });

      // Si existe un lote prioritario y no es el mismo que se escaneó
      if (lotePrioritarioFefo && lotePrioritarioFefo.id_lote !== loteSeleccionado.id_lote) {
        // Uso de dayjs para comparar fechas sin desfases de zona horaria
        const fechaVencSeleccionado = dayjs(loteSeleccionado.fecha_vencimiento);
        const fechaVencPrioritario = dayjs(lotePrioritarioFefo.fecha_vencimiento);

        // Si el lote que el operario intenta sacar vence DESPUÉS del prioritario: BLOQUEAR
        if (fechaVencSeleccionado.isAfter(fechaVencPrioritario, 'day')) {
          const mensajeError = `Infracción FEFO: Existe un lote más antiguo que debe ser despachado primero (Lote: ${lotePrioritarioFefo.numero_lote}, Vence: ${fechaVencPrioritario.format('DD/MM/YYYY')})`;
          const errorFefo = new Error(mensajeError);
          errorFefo.statusCode = 403; // HTTP 403 Forbidden obligatorio
          errorFefo.data = {
            codigo_bloqueo: 'FEFO_VIOLATION_HTTP_403',
            regla_aplicada: 'FEFO (First Expired, First Out)',
            insumo: {
              id_insumo: insumo.id_insumo,
              codigo_institucional: insumo.codigo_institucional,
              nombre: insumo.nombre,
              tipo: insumo.tipo
            },
            lote_rechazado: {
              id_lote: loteSeleccionado.id_lote,
              numero_lote: loteSeleccionado.numero_lote,
              codigo_qr: loteSeleccionado.codigo_qr,
              fecha_vencimiento: loteSeleccionado.fecha_vencimiento,
              cantidad_actual: loteSeleccionado.cantidad_actual,
              ubicacion_pasillo: loteSeleccionado.ubicacion_pasillo
            },
            lote_obligatorio: {
              id_lote: lotePrioritarioFefo.id_lote,
              numero_lote: lotePrioritarioFefo.numero_lote,
              codigo_qr: lotePrioritarioFefo.codigo_qr,
              fecha_vencimiento: lotePrioritarioFefo.fecha_vencimiento,
              cantidad_disponible: lotePrioritarioFefo.cantidad_actual,
              ubicacion_pasillo: lotePrioritarioFefo.ubicacion_pasillo || 'No especificado'
            }
          };
          throw errorFefo;
        }
      }
    } else {
      // ---------------------------------------------------------------------
      // REGLA FIFO: Buscar el lote de insumo administrativo con fecha de ingreso
      // más antigua que tenga stock disponible (> 0).
      // ---------------------------------------------------------------------
      const lotePrioritarioFifo = await Lote.findOne({
        where: {
          id_insumo: insumo.id_insumo,
          estado: 'DISPONIBLE',
          cantidad_actual: { [Op.gt]: 0 },
          deleted_at: null
        },
        order: [
          ['fecha_ingreso', 'ASC'], // Ingreso más antiguo primero
          ['id_lote', 'ASC']
        ],
        transaction,
        lock: transaction.LOCK.SHARE
      });

      if (lotePrioritarioFifo && lotePrioritarioFifo.id_lote !== loteSeleccionado.id_lote) {
        const fechaIngresoSeleccionado = dayjs(loteSeleccionado.fecha_ingreso);
        const fechaIngresoPrioritario = dayjs(lotePrioritarioFifo.fecha_ingreso);

        if (fechaIngresoSeleccionado.isAfter(fechaIngresoPrioritario, 'day')) {
          const mensajeError = `Infracción FIFO: Existe un lote más antiguo que debe ser despachado primero (Lote: ${lotePrioritarioFifo.numero_lote}, Ingreso: ${fechaIngresoPrioritario.format('DD/MM/YYYY')})`;
          const errorFifo = new Error(mensajeError);
          errorFifo.statusCode = 403;
          errorFifo.data = {
            codigo_bloqueo: 'FIFO_VIOLATION_HTTP_403',
            regla_aplicada: 'FIFO (First In, First Out)',
            insumo: {
              id_insumo: insumo.id_insumo,
              codigo: insumo.codigo_institucional,
              nombre: insumo.nombre
            },
            lote_rechazado: {
              id_lote: loteSeleccionado.id_lote,
              numero_lote: loteSeleccionado.numero_lote,
              fecha_ingreso: loteSeleccionado.fecha_ingreso
            },
            lote_obligatorio: {
              id_lote: lotePrioritarioFifo.id_lote,
              numero_lote: lotePrioritarioFifo.numero_lote,
              codigo_qr: lotePrioritarioFifo.codigo_qr,
              fecha_ingreso: lotePrioritarioFifo.fecha_ingreso,
              cantidad_disponible: lotePrioritarioFifo.cantidad_actual,
              ubicacion_pasillo: lotePrioritarioFifo.ubicacion_pasillo || 'No especificado'
            }
          };
          throw errorFifo;
        }
      }
    }

    return true;
  }

  /**
   * Ejecuta el despacho físico de un lote, debitando el saldo de manera atómica
   * y registrando el egreso inmutable en el Kardex hospitalario.
   *
   * @param {Object} params - Parámetros del despacho
   * @param {string} [params.codigo_qr] - Código QR escaneado por el móvil
   * @param {number} [params.id_lote] - ID de lote alternativo
   * @param {number} params.cantidad - Cantidad de unidades a despachar
   * @param {number} [params.id_solicitud] - ID de solicitud hospitalaria asociada
   * @param {string} [params.departamento_destino] - Servicio o sala médica de destino
   * @param {string} [params.observaciones] - Notas del operario
   * @param {number} id_usuario - ID del operario autenticado
   */
  async ejecutarDespachoLote(params, id_usuario) {
    const {
      codigo_qr,
      id_lote,
      cantidad,
      id_solicitud,
      departamento_destino,
      observaciones
    } = params;

    const cantidadADespachar = parseInt(cantidad, 10);
    if (isNaN(cantidadADespachar) || cantidadADespachar <= 0) {
      const err = new Error('La cantidad a despachar debe ser un número entero mayor a 0.');
      err.statusCode = 400;
      throw err;
    }

    if (!codigo_qr && !id_lote) {
      const err = new Error('Debe proporcionar el código QR escaneado o el ID del lote.');
      err.statusCode = 400;
      throw err;
    }

    // Ejecución dentro de una transacción ACID con bloqueo de fila (Pessimistic Locking)
    return await sequelize.transaction(async (t) => {
      // 1. Obtener el lote con bloqueo exclusivo para evitar condiciones de carrera (Race Conditions)
      const whereLote = codigo_qr ? { codigo_qr: codigo_qr.trim() } : { id_lote };
      const lote = await Lote.findOne({
        where: whereLote,
        include: [{ model: Insumo, as: 'insumo' }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!lote) {
        const err = new Error('El lote indicado no fue localizado en la base de datos.');
        err.statusCode = 404;
        throw err;
      }

      if (lote.estado !== 'DISPONIBLE' || lote.cantidad_actual <= 0) {
        const err = new Error(`El lote [${lote.numero_lote}] no se encuentra disponible para despacho. Estado actual: ${lote.estado}. Saldo: ${lote.cantidad_actual}`);
        err.statusCode = 400;
        throw err;
      }

      // Validar si el lote ya venció físicamente
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaVenc = new Date(lote.fecha_vencimiento);
      if (fechaVenc < hoy) {
        // Marcar lote como vencido de forma preventiva
        await lote.update({ estado: 'VENCIDO' }, { transaction: t });
        const err = new Error(`Alerta Sanitaria: El lote [${lote.numero_lote}] ha caducado el ${lote.fecha_vencimiento}. Se ha bloqueado su despacho automáticamente.`);
        err.statusCode = 403;
        throw err;
      }

      // 2. APLICAR REGLA FEFO / FIFO ESTRICTA
      await this.validarRotacionInventario(lote, lote.insumo, t);

      // 3. Validar disponibilidad de stock en el lote específico (Lógica por lotes, no global)
      if (lote.cantidad_actual < cantidadADespachar) {
        const err = new Error(
          `Stock insuficiente en el lote específico [${lote.numero_lote}]. Existencia en lote: ${lote.cantidad_actual} unidades. Cantidad solicitada: ${cantidadADespachar}.`
        );
        err.statusCode = 400;
        err.data = {
          saldo_disponible_lote: lote.cantidad_actual,
          cantidad_solicitada: cantidadADespachar
        };
        throw err;
      }

      // 4. Debitar saldo del lote
      const nuevoSaldo = lote.cantidad_actual - cantidadADespachar;
      const nuevoEstado = nuevoSaldo === 0 ? 'AGOTADO' : 'DISPONIBLE';

      await lote.update({
        cantidad_actual: nuevoSaldo,
        estado: nuevoEstado
      }, { transaction: t });

      // 5. Insertar registro inmutable en 'MovimientoKardex'
      const costoTotal = parseFloat((cantidadADespachar * lote.costo_unitario).toFixed(2));
      const movimientoKardex = await MovimientoKardex.create({
        id_insumo: lote.id_insumo,
        id_lote: lote.id_lote,
        id_usuario,
        id_solicitud: id_solicitud || null,
        tipo_movimiento: 'DESPACHO',
        cantidad: cantidadADespachar,
        saldo_lote_resultante: nuevoSaldo,
        costo_unitario: lote.costo_unitario,
        costo_total: costoTotal,
        fecha_movimiento: new Date(),
        observaciones: `Despacho validado (${lote.insumo.tipo === 'SANITARIO' ? 'FEFO' : 'FIFO'}). Destino: ${departamento_destino || 'General'}. ${observaciones || ''}`.trim()
      }, { transaction: t });

      // 6. Si está vinculado a una solicitud hospitalaria, actualizar su detalle
      let solicitudActualizada = null;
      if (id_solicitud) {
        const detalle = await DetalleSolicitud.findOne({
          where: {
            id_solicitud,
            id_insumo: lote.id_insumo
          },
          transaction: t
        });

        if (detalle) {
          const nuevaCantidadDespachada = detalle.cantidad_despachada + cantidadADespachar;
          await detalle.update({ cantidad_despachada: nuevaCantidadDespachada }, { transaction: t });

          // Verificar si todos los detalles de la solicitud se han completado
          const todosLosDetalles = await DetalleSolicitud.findAll({
            where: { id_solicitud },
            transaction: t
          });

          const completado = todosLosDetalles.every(d => d.cantidad_despachada >= d.cantidad_solicitada);
          const solicitud = await SolicitudDespacho.findByPk(id_solicitud, { transaction: t });

          if (solicitud) {
            await solicitud.update({
              estado: completado ? 'COMPLETADO' : 'EN_PROCESO'
            }, { transaction: t });
            solicitudActualizada = { id_solicitud, estado: completado ? 'COMPLETADO' : 'EN_PROCESO' };
          }
        }
      }

      return {
        despacho_exitoso: true,
        insumo: {
          id_insumo: lote.insumo.id_insumo,
          codigo_institucional: lote.insumo.codigo_institucional,
          nombre: lote.insumo.nombre,
          tipo: lote.insumo.tipo
        },
        lote: {
          id_lote: lote.id_lote,
          numero_lote: lote.numero_lote,
          codigo_qr: lote.codigo_qr,
          cantidad_despachada: cantidadADespachar,
          saldo_restante_lote: nuevoSaldo,
          estado_lote: nuevoEstado,
          ubicacion_pasillo: lote.ubicacion_pasillo
        },
        kardex: {
          id_movimiento: movimientoKardex.id_movimiento,
          fecha: movimientoKardex.fecha_movimiento,
          costo_unitario: movimientoKardex.costo_unitario,
          costo_total: movimientoKardex.costo_total
        },
        solicitud: solicitudActualizada
      };
    });
  }

  /**
   * Obtiene de forma preventiva el lote prioritario que el operario DEBE buscar en pasillo.
   * Asiste al operario móvil guiándolo directamente al pasillo correcto antes de escanear.
   */
  async obtenerLoteSugerido(id_insumo) {
    const insumo = await Insumo.findByPk(id_insumo);
    if (!insumo) {
      const err = new Error(`Insumo con ID ${id_insumo} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    const esSanitario = insumo.tipo === 'SANITARIO';
    const orden = esSanitario
      ? [['fecha_vencimiento', 'ASC'], ['id_lote', 'ASC']]
      : [['fecha_ingreso', 'ASC'], ['id_lote', 'ASC']];

    const lotePrioritario = await Lote.findOne({
      where: {
        id_insumo,
        estado: 'DISPONIBLE',
        cantidad_actual: { [Op.gt]: 0 },
        deleted_at: null
      },
      include: [
        { model: Proveedor, as: 'proveedor', attributes: ['razon_social'] }
      ],
      order: orden
    });

    if (!lotePrioritario) {
      return {
        hay_disponibilidad: false,
        mensaje: `No hay lotes con existencias disponibles para el insumo [${insumo.nombre}].`
      };
    }

    return {
      hay_disponibilidad: true,
      criterio_aplicado: esSanitario ? 'FEFO (Vencimiento más próximo)' : 'FIFO (Ingreso más antiguo)',
      insumo: {
        id_insumo: insumo.id_insumo,
        codigo_institucional: insumo.codigo_institucional,
        nombre: insumo.nombre,
        tipo: insumo.tipo
      },
      lote_sugerido: {
        id_lote: lotePrioritario.id_lote,
        numero_lote: lotePrioritario.numero_lote,
        codigo_qr: lotePrioritario.codigo_qr,
        cantidad_disponible: lotePrioritario.cantidad_actual,
        fecha_vencimiento: lotePrioritario.fecha_vencimiento,
        fecha_ingreso: lotePrioritario.fecha_ingreso,
        ubicacion_pasillo: lotePrioritario.ubicacion_pasillo || 'Sin ubicación registrada',
        proveedor: lotePrioritario.proveedor ? lotePrioritario.proveedor.razon_social : 'N/A'
      }
    };
  }

  /**
   * Consulta el historial inmutable de Kardex de un insumo
   */
  async getKardexByInsumo(id_insumo, filtros = {}) {
    const { pagina = 1, limite = 50 } = filtros;
    const limit = Math.min(parseInt(limite, 10) || 50, 100);
    const offset = ((parseInt(pagina, 10) || 1) - 1) * limit;

    const { count, rows } = await MovimientoKardex.findAndCountAll({
      where: { id_insumo },
      include: [
        { model: Lote, as: 'lote', attributes: ['numero_lote', 'codigo_qr', 'fecha_vencimiento'] },
        { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre_completo', 'email'] }
      ],
      order: [['fecha_movimiento', 'DESC']],
      limit,
      offset
    });

    return {
      total: count,
      pagina: parseInt(pagina, 10) || 1,
      total_paginas: Math.ceil(count / limit),
      limite,
      movimientos: rows
    };
  }

  /**
   * Módulo de Escaneo QR (React Native a Node.js)
   * Devuelve: Datos del Insumo, Datos del Lote, Stock Actual y booleano isVencido
   * @param {string} codigoQr - Cadena alfanumérica decodificada del código QR
   */
  async escanearLoteQr(codigoQr) {
    if (!codigoQr || !codigoQr.trim()) {
      const error = new Error('El código QR es requerido para la consulta.');
      error.statusCode = 400;
      throw error;
    }

    const lote = await Lote.findOne({
      where: { codigo_qr: codigoQr.trim() },
      include: [
        { model: Insumo, as: 'insumo' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    if (!lote) {
      const error = new Error(`Código QR no localizado en inventario: ${codigoQr}`);
      error.statusCode = 404;
      throw error;
    }

    // Uso estricto de dayjs para evitar discrepancias de zona horaria entre servidor y cliente
    const fechaVenc = dayjs(lote.fecha_vencimiento);
    const hoy = dayjs().startOf('day');
    const isVencido = fechaVenc.isBefore(hoy);

    return {
      insumo: lote.insumo,
      lote: {
        id_lote: lote.id_lote,
        numero_lote: lote.numero_lote,
        codigo_qr: lote.codigo_qr,
        fecha_vencimiento: lote.fecha_vencimiento,
        fecha_ingreso: lote.fecha_ingreso,
        costo_unitario: lote.costo_unitario,
        ubicacion_pasillo: lote.ubicacion_pasillo,
        estado: lote.estado
      },
      stock_actual: lote.cantidad_actual,
      isVencido
    };
  }
}

module.exports = new DispatchService();

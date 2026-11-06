/**
 * @file reception.service.js
 * @description Capa de servicio para la recepción de mercancía e ingresos por lotes.
 * Cumple con transaccionalidad ACID estricta, registro inmutable en Kardex y emisión de Códigos QR.
 */

const QRCode = require('qrcode');
const crypto = require('crypto');
const { sequelize, Lote, MovimientoKardex, Insumo, Proveedor, Usuario } = require('../../models');

class ReceptionService {
  /**
   * Genera un identificador QR único de alta entropía para el lote
   */
  generarCodigoQrUnico(idInsumo, numeroLote) {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `CPS-LOT-${idInsumo}-${timestamp}-${randomHex}`;
  }

  /**
   * Genera la imagen QR en formato Base64 para etiquetas térmicas
   */
  async generarImagenQrBase64(contenido) {
    return await QRCode.toDataURL(contenido, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      scale: 6,
      color: {
        dark: '#002B49', // Azul institucional CPS
        light: '#FFFFFF'
      }
    });
  }

  /**
   * Procesa el ingreso de mercancía creando N lotes de forma transaccional (ACID)
   * e insertando los registros inmutables de auditoría contable en Kardex.
   *
   * @param {Object} data - Datos de recepción
   * @param {number} data.id_proveedor - ID del proveedor de la orden de entrega
   * @param {Array} data.lotes - Colección de lotes a ingresar
   * @param {string} [data.observaciones_generales] - Comentarios de recepción
   * @param {number} id_usuario - ID del encargado autenticado que recibe
   */
  async registrarIngresoMercancia(data, id_usuario) {
    const { id_proveedor, lotes, observaciones_generales } = data;

    if (!id_proveedor) {
      const err = new Error('El proveedor de la recepción es obligatorio.');
      err.statusCode = 400;
      throw err;
    }

    if (!Array.isArray(lotes) || lotes.length === 0) {
      const err = new Error('Debe proporcionar al menos un lote para procesar la recepción.');
      err.statusCode = 400;
      throw err;
    }

    // Verificar existencia del proveedor
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor || !proveedor.activo) {
      const err = new Error('El proveedor especificado no existe o no se encuentra activo.');
      err.statusCode = 404;
      throw err;
    }

    // Ejecución transaccional ACID completa
    const resultadoTransaccion = await sequelize.transaction(async (t) => {
      const lotesCreados = [];

      for (const item of lotes) {
        const {
          id_insumo,
          numero_lote,
          cantidad,
          costo_unitario,
          fecha_vencimiento,
          ubicacion_pasillo
        } = item;

        // Validaciones por lote
        if (!id_insumo || !numero_lote || !cantidad || costo_unitario === undefined || !fecha_vencimiento) {
          const err = new Error(`Datos incompletos en el lote [${numero_lote || 'Sin número'}]. Requiere id_insumo, numero_lote, cantidad, costo_unitario y fecha_vencimiento.`);
          err.statusCode = 400;
          throw err;
        }

        const cantidadInt = parseInt(cantidad, 10);
        const costoDec = parseFloat(costo_unitario);

        if (isNaN(cantidadInt) || cantidadInt <= 0) {
          const err = new Error(`La cantidad del lote [${numero_lote}] debe ser un número entero mayor a 0.`);
          err.statusCode = 400;
          throw err;
        }

        if (isNaN(costoDec) || costoDec < 0) {
          const err = new Error(`El costo unitario del lote [${numero_lote}] debe ser mayor o igual a 0.`);
          err.statusCode = 400;
          throw err;
        }

        // Consultar el insumo para validar sus reglas
        const insumo = await Insumo.findByPk(id_insumo, { transaction: t });
        if (!insumo || !insumo.activo) {
          const err = new Error(`El insumo con ID [${id_insumo}] no existe o está inactivo.`);
          err.statusCode = 404;
          throw err;
        }

        // Validación estricta para insumos Sanitarios (FEFO): no admitir insumos vencidos al ingreso
        const fechaVenc = new Date(fecha_vencimiento);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (insumo.tipo === 'SANITARIO' && fechaVenc <= hoy) {
          const err = new Error(`Rechazo Sanitario: El lote [${numero_lote}] del fármaco/insumo [${insumo.nombre}] tiene fecha de caducidad pasada o del día (${fecha_vencimiento}). No se admite su ingreso.`);
          err.statusCode = 400;
          throw err;
        }

        // Generar identificador QR único
        const codigoQr = this.generarCodigoQrUnico(id_insumo, numero_lote);

        // 1. Crear el registro en tabla 'Lotes'
        const nuevoLote = await Lote.create({
          id_insumo,
          id_proveedor,
          numero_lote: numero_lote.trim(),
          codigo_qr: codigoQr,
          cantidad_inicial: cantidadInt,
          cantidad_actual: cantidadInt,
          costo_unitario: costoDec,
          fecha_ingreso: new Date(),
          fecha_vencimiento: fecha_vencimiento,
          estado: 'DISPONIBLE',
          ubicacion_pasillo: ubicacion_pasillo ? ubicacion_pasillo.trim() : null
        }, { transaction: t });

        // 2. Insertar registro inmutable en 'MovimientoKardex'
        const costoTotal = parseFloat((cantidadInt * costoDec).toFixed(2));
        await MovimientoKardex.create({
          id_insumo,
          id_lote: nuevoLote.id_lote,
          id_usuario,
          id_solicitud: null,
          tipo_movimiento: 'INGRESO',
          cantidad: cantidadInt,
          saldo_lote_resultante: cantidadInt,
          costo_unitario: costoDec,
          costo_total: costoTotal,
          fecha_movimiento: new Date(),
          observaciones: `Recepción de lote inicial. Proveedor: ${proveedor.razon_social}. ${observaciones_generales || ''}`.trim()
        }, { transaction: t });

        // Contenido estructurado para la etiqueta y el QR
        const qrPayload = JSON.stringify({
          qr: codigoQr,
          lote_id: nuevoLote.id_lote,
          num_lote: nuevoLote.numero_lote,
          insumo_cod: insumo.codigo_institucional,
          venc: nuevoLote.fecha_vencimiento,
          tipo: insumo.tipo
        });

        lotesCreados.push({
          lote: nuevoLote,
          insumo: {
            id_insumo: insumo.id_insumo,
            codigo_institucional: insumo.codigo_institucional,
            nombre: insumo.nombre,
            tipo: insumo.tipo,
            unidad_medida: insumo.unidad_medida
          },
          qr_data: qrPayload,
          codigo_qr: codigoQr
        });
      }

      return lotesCreados;
    });

    // 3. Generar las imágenes QR en Base64 fuera de la transacción para máxima agilidad en DB
    const lotesConEtiquetas = await Promise.all(
      resultadoTransaccion.map(async (item) => {
        const qrImageBase64 = await this.generarImagenQrBase64(item.codigo_qr);
        return {
          id_lote: item.lote.id_lote,
          numero_lote: item.lote.numero_lote,
          codigo_qr: item.codigo_qr,
          cantidad_ingresada: item.lote.cantidad_inicial,
          costo_unitario: item.lote.costo_unitario,
          fecha_ingreso: item.lote.fecha_ingreso,
          fecha_vencimiento: item.lote.fecha_vencimiento,
          ubicacion_pasillo: item.lote.ubicacion_pasillo,
          insumo: item.insumo,
          proveedor: {
            id_proveedor: proveedor.id_proveedor,
            razon_social: proveedor.razon_social
          },
          etiqueta_impresion: {
            qr_base64: qrImageBase64,
            payload_qr: item.codigo_qr,
            titulo: 'CAJA PETROLERA DE SALUD - ALMACÉN CENTRAL',
            texto_insumo: `${item.insumo.codigo_institucional} - ${item.insumo.nombre}`,
            texto_lote: `LOTE: ${item.lote.numero_lote} | VENCE: ${item.lote.fecha_vencimiento}`,
            texto_tipo: `CRITERIO: ${item.insumo.tipo === 'SANITARIO' ? 'FEFO (Sanitario)' : 'FIFO (Administrativo)'}`,
            texto_ubicacion: `PASILLO: ${item.lote.ubicacion_pasillo || 'Sin asignar'}`
          }
        };
      })
    );

    return {
      total_lotes_recibidos: lotesConEtiquetas.length,
      proveedor: {
        id_proveedor: proveedor.id_proveedor,
        razon_social: proveedor.razon_social
      },
      lotes: lotesConEtiquetas
    };
  }

  /**
   * Obtener listado de lotes con filtros avanzados
   */
  async getLotes(query = {}) {
    const { id_insumo, id_proveedor, estado, pagina = 1, limite = 50 } = query;
    const where = {};

    if (id_insumo) where.id_insumo = id_insumo;
    if (id_proveedor) where.id_proveedor = id_proveedor;
    if (estado) where.estado = estado;

    const limit = Math.min(parseInt(limite, 10) || 50, 100);
    const offset = ((parseInt(pagina, 10) || 1) - 1) * limit;

    const { count, rows } = await Lote.findAndCountAll({
      where,
      include: [
        { model: Insumo, as: 'insumo', attributes: ['id_insumo', 'codigo_institucional', 'nombre', 'tipo', 'unidad_medida'] },
        { model: Proveedor, as: 'proveedor', attributes: ['id_proveedor', 'razon_social'] }
      ],
      order: [['fecha_vencimiento', 'ASC']],
      limit,
      offset
    });

    return {
      total: count,
      pagina: parseInt(pagina, 10) || 1,
      total_paginas: Math.ceil(count / limit),
      limite,
      lotes: rows
    };
  }

  /**
   * Obtener detalle de un lote por su código QR único (Crucial para el escáner móvil)
   */
  async getLoteByQr(codigoQr) {
    if (!codigoQr) {
      const err = new Error('Debe proporcionar el código QR a consultar.');
      err.statusCode = 400;
      throw err;
    }

    const lote = await Lote.findOne({
      where: { codigo_qr: codigoQr.trim() },
      include: [
        { model: Insumo, as: 'insumo' },
        { model: Proveedor, as: 'proveedor', attributes: ['id_proveedor', 'razon_social'] }
      ]
    });

    if (!lote) {
      const err = new Error(`No se encontró ningún lote con el código QR escaneado: [${codigoQr}]`);
      err.statusCode = 404;
      throw err;
    }

    const qrImageBase64 = await this.generarImagenQrBase64(lote.codigo_qr);

    return {
      ...lote.get({ plain: true }),
      qr_image_base64: qrImageBase64
    };
  }

  /**
   * Reimprimir etiqueta QR para un lote ya existente
   */
  async reimprimirQrLote(id_lote) {
    const lote = await Lote.findByPk(id_lote, {
      include: [
        { model: Insumo, as: 'insumo' },
        { model: Proveedor, as: 'proveedor', attributes: ['id_proveedor', 'razon_social'] }
      ]
    });

    if (!lote) {
      const err = new Error(`Lote con ID ${id_lote} no encontrado.`);
      err.statusCode = 404;
      throw err;
    }

    const qrImageBase64 = await this.generarImagenQrBase64(lote.codigo_qr);

    return {
      id_lote: lote.id_lote,
      numero_lote: lote.numero_lote,
      codigo_qr: lote.codigo_qr,
      cantidad_actual: lote.cantidad_actual,
      fecha_vencimiento: lote.fecha_vencimiento,
      insumo: lote.insumo,
      proveedor: lote.proveedor,
      etiqueta_impresion: {
        qr_base64: qrImageBase64,
        payload_qr: lote.codigo_qr,
        titulo: 'CAJA PETROLERA DE SALUD - REIMPRESIÓN',
        texto_insumo: `${lote.insumo.codigo_institucional} - ${lote.insumo.nombre}`,
        texto_lote: `LOTE: ${lote.numero_lote} | VENCE: ${lote.fecha_vencimiento}`,
        texto_tipo: `CRITERIO: ${lote.insumo.tipo === 'SANITARIO' ? 'FEFO (Sanitario)' : 'FIFO (Administrativo)'}`,
        texto_ubicacion: `PASILLO: ${lote.ubicacion_pasillo || 'Sin asignar'}`
      }
    };
  }
}

module.exports = new ReceptionService();

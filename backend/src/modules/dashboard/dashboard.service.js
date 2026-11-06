/**
 * @file dashboard.service.js
 * @description Servicio analítico gerencial para el cálculo de valorización de almacén,
 * rotación de inventario y semáforo de alertas de caducidad (<30 días Roja, <60 días Amarilla).
 */

const { Op, literal, fn, col } = require('sequelize');
const { Lote, Insumo, MovimientoKardex, Proveedor, sequelize } = require('../../models');

class DashboardService {
  /**
   * Obtiene el consolidado general de métricas gerenciales y semáforo de caducidades
   */
  async getMetricsConsolidated() {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];

    // 1. VALOR MONETARIO TOTAL DEL ALMACÉN (Lotes activos DISPONIBLE con stock > 0)
    const valorizacionQuery = await Lote.findOne({
      attributes: [
        [literal('COALESCE(SUM(cantidad_actual * costo_unitario), 0)'), 'valor_total'],
        [literal('COALESCE(SUM(cantidad_actual), 0)'), 'total_unidades_fisicas'],
        [literal('COUNT(id_lote)'), 'total_lotes_activos']
      ],
      where: {
        estado: 'DISPONIBLE',
        cantidad_actual: { [Op.gt]: 0 },
        deleted_at: null
      },
      raw: true
    });

    const valorTotalAlmacen = parseFloat(valorizacionQuery?.valor_total || 0);
    const totalUnidadesFisicas = parseInt(valorizacionQuery?.total_unidades_fisicas || 0, 10);
    const totalLotesActivos = parseInt(valorizacionQuery?.total_lotes_activos || 0, 10);

    // 2. VALOR MONETARIO SEGREGADO: SANITARIOS (Fármacos) vs ADMINISTRATIVOS
    const valorPorTipo = await Lote.findAll({
      attributes: [
        [col('insumo.tipo'), 'tipo_insumo'],
        [literal('COALESCE(SUM(lotes.cantidad_actual * lotes.costo_unitario), 0)'), 'valor_subtotal'],
        [literal('COALESCE(SUM(lotes.cantidad_actual), 0)'), 'unidades_subtotal']
      ],
      include: [
        { model: Insumo, as: 'insumo', attributes: [] }
      ],
      where: {
        estado: 'DISPONIBLE',
        cantidad_actual: { [Op.gt]: 0 },
        deleted_at: null
      },
      group: ['insumo.tipo'],
      raw: true
    });

    let valorSanitario = 0;
    let valorAdministrativo = 0;
    valorPorTipo.forEach(item => {
      const val = parseFloat(item.valor_subtotal || 0);
      if (item.tipo_insumo === 'SANITARIO') valorSanitario = val;
      if (item.tipo_insumo === 'ADMINISTRATIVO') valorAdministrativo = val;
    });

    // 3. TASA DE ROTACIÓN DE INVENTARIO (Últimos 30 días)
    // Fórmula: Costo de lo Despachado en el período / Inventario Promedio
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    const costoDespachos30Dias = await MovimientoKardex.sum('costo_total', {
      where: {
        tipo_movimiento: 'DESPACHO',
        fecha_movimiento: { [Op.gte]: hace30Dias },
        deleted_at: null
      }
    }) || 0;

    // Tasa de rotación (veces al mes) y días de inventario disponible
    const tasaRotacion = valorTotalAlmacen > 0
      ? parseFloat((costoDespachos30Dias / valorTotalAlmacen).toFixed(2))
      : 0;
    const diasInventario = tasaRotacion > 0
      ? Math.round(30 / tasaRotacion)
      : 0;

    // 4. SISTEMA SEMAFÓRICO DE ALERTAS DE CADUCIDAD
    // ALERTA ROJA (< 30 días): Lotes con caducidad inminente o ya vencidos
    // ALERTA AMARILLA (31 a 60 días): Lotes preventivos para acelerar rotación FEFO
    const lotesCriticos = await Lote.findAll({
      attributes: [
        'id_lote',
        'numero_lote',
        'codigo_qr',
        'cantidad_actual',
        'costo_unitario',
        'fecha_vencimiento',
        'ubicacion_pasillo',
        [literal(`DATEDIFF(fecha_vencimiento, '${hoyStr}')`), 'dias_para_vencer']
      ],
      include: [
        {
          model: Insumo,
          as: 'insumo',
          attributes: ['id_insumo', 'codigo_institucional', 'nombre', 'tipo', 'unidad_medida']
        },
        {
          model: Proveedor,
          as: 'proveedor',
          attributes: ['id_proveedor', 'razon_social']
        }
      ],
      where: {
        estado: 'DISPONIBLE',
        cantidad_actual: { [Op.gt]: 0 },
        // Lotes que vencen en los próximos 60 días o que ya tienen caducidad vencida
        [Op.and]: [
          literal(`DATEDIFF(fecha_vencimiento, '${hoyStr}') <= 60`)
        ],
        deleted_at: null
      },
      order: [['fecha_vencimiento', 'ASC']],
      raw: false
    });

    const alertaRoja = [];
    const alertaAmarilla = [];
    let valorEnRiesgoRojo = 0;
    let valorEnRiesgoAmarillo = 0;

    lotesCriticos.forEach(l => {
      const dias = parseInt(l.get('dias_para_vencer'), 10);
      const valorLote = parseFloat((l.cantidad_actual * l.costo_unitario).toFixed(2));
      const loteData = {
        id_lote: l.id_lote,
        numero_lote: l.numero_lote,
        codigo_qr: l.codigo_qr,
        cantidad_actual: l.cantidad_actual,
        costo_unitario: l.costo_unitario,
        valor_total_lote: valorLote,
        fecha_vencimiento: l.fecha_vencimiento,
        dias_restantes: dias,
        ubicacion_pasillo: l.ubicacion_pasillo || 'Sin asignar',
        insumo: l.insumo,
        proveedor: l.proveedor
      };

      if (dias <= 30) {
        // Alerta Roja (< 30 días o vencidos)
        loteData.nivel_alerta = dias < 0 ? 'VENCIDO' : 'ROJA_CRITICA';
        alertaRoja.push(loteData);
        valorEnRiesgoRojo += valorLote;
      } else {
        // Alerta Amarilla (31 - 60 días)
        loteData.nivel_alerta = 'AMARILLA_PREVENTIVA';
        alertaAmarilla.push(loteData);
        valorEnRiesgoAmarillo += valorLote;
      }
    });

    // 5. INSUMOS EN PUNTO DE REORDEN O QUIEBRE DE STOCK
    const insumosReorden = await Insumo.findAll({
      attributes: [
        'id_insumo',
        'codigo_institucional',
        'nombre',
        'tipo',
        'unidad_medida',
        'stock_minimo',
        'punto_reorden',
        [
          literal(`(
            SELECT COALESCE(SUM(l.cantidad_actual), 0)
            FROM lotes AS l
            WHERE l.id_insumo = Insumo.id_insumo
              AND l.estado = 'DISPONIBLE'
              AND l.deleted_at IS NULL
          )`),
          'stock_actual'
        ]
      ],
      where: { activo: true },
      having: literal('stock_actual <= Insumo.punto_reorden'),
      order: [[literal('stock_actual'), 'ASC']],
      limit: 10
    });

    // 6. HISTORIAL DE MOVIMIENTOS RECIENTES DE KARDEX
    const ultimosMovimientos = await MovimientoKardex.findAll({
      attributes: [
        'id_movimiento',
        'tipo_movimiento',
        'cantidad',
        'costo_total',
        'fecha_movimiento',
        'observaciones'
      ],
      include: [
        { model: Insumo, as: 'insumo', attributes: ['codigo_institucional', 'nombre', 'tipo'] },
        { model: Lote, as: 'lote', attributes: ['numero_lote', 'fecha_vencimiento'] }
      ],
      order: [['fecha_movimiento', 'DESC']],
      limit: 10
    });

    return {
      resumen_financiero: {
        valor_total_almacen: valorTotalAlmacen,
        valor_sanitarios: valorSanitario,
        valor_administrativos: valorAdministrativo,
        moneda: 'BOB (Bolivianos)',
        total_unidades_fisicas: totalUnidadesFisicas,
        total_lotes_activos: totalLotesActivos
      },
      indicadores_gestion: {
        tasa_rotacion_mensual: tasaRotacion,
        dias_inventario_promedio: diasInventario,
        costo_despachos_30_dias: parseFloat(costoDespachos30Dias.toFixed(2))
      },
      semaforo_caducidad: {
        total_lotes_en_alerta: alertaRoja.length + alertaAmarilla.length,
        alerta_roja: {
          total: alertaRoja.length,
          valor_en_riesgo: parseFloat(valorEnRiesgoRojo.toFixed(2)),
          criterio: '< 30 días para caducar o vencido',
          lotes: alertaRoja
        },
        alerta_amarilla: {
          total: alertaAmarilla.length,
          valor_en_riesgo: parseFloat(valorEnRiesgoAmarillo.toFixed(2)),
          criterio: 'Entre 31 y 60 días para caducar',
          lotes: alertaAmarilla
        }
      },
      quiebres_y_reorden: insumosReorden.map(i => {
        const plain = i.get({ plain: true });
        const stock = parseInt(plain.stock_actual || 0, 10);
        return {
          ...plain,
          stock_actual: stock,
          estado_urgencia: stock <= plain.stock_minimo ? 'QUIEBRE_CRITICO' : 'REORDEN_NECESARIO'
        };
      }),
      ultimos_movimientos: ultimosMovimientos
    };
  }
}

module.exports = new DashboardService();

/**
 * @file MovimientoKardex.js
 * @description Registro de auditoría contable de inventarios inmutable (Append-Only).
 * Base de datos para balance de existencias y modelo predictivo de IA.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoKardex = sequelize.define('MovimientoKardex', {
  id_movimiento: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_movimiento'
  },
  id_insumo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_insumo'
  },
  id_lote: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_lote'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_solicitud'
  },
  tipo_movimiento: {
    type: DataTypes.ENUM('INGRESO', 'DESPACHO', 'AJUSTE', 'BAJA_VENCIMIENTO'),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  saldo_lote_resultante: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  costo_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  costo_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  observaciones: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'movimiento_kardex',
  timestamps: false,
  hooks: {
    // Garantía estricta de inmutabilidad: el historial de kardex jamás puede alterarse
    beforeUpdate: () => {
      throw new Error('Inmutabilidad Violada: Las transacciones de Kardex son inmutables y no admiten modificación.');
    },
    beforeDestroy: () => {
      throw new Error('Inmutabilidad Violada: Las transacciones de Kardex no pueden eliminarse físicamente.');
    }
  }
});

module.exports = MovimientoKardex;

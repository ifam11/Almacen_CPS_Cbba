/**
 * @file Lote.js
 * @description Modelo de Lote: Gestión atómica por lotes con código QR único, fecha de ingreso y caducidad.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lote = sequelize.define('Lote', {
  id_lote: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_lote'
  },
  id_insumo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_insumo'
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_proveedor'
  },
  numero_lote: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo_qr: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  cantidad_inicial: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  cantidad_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  costo_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('DISPONIBLE', 'AGOTADO', 'VENCIDO', 'CUARENTENA'),
    defaultValue: 'DISPONIBLE',
    allowNull: false
  },
  ubicacion_pasillo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'lotes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = Lote;

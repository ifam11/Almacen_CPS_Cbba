/**
 * @file SolicitudDespacho.js
 * @description Modelo de Solicitudes de Despacho hospitalarias.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudDespacho = sequelize.define('SolicitudDespacho', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_solicitud'
  },
  codigo_solicitud: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  id_usuario_solicitante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_solicitante'
  },
  departamento_destino: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'RECHAZADO'),
    defaultValue: 'PENDIENTE',
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'solicitudes_despacho',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = SolicitudDespacho;

/**
 * @file DetalleSolicitud.js
 * @description Items y cantidades solicitadas por servicio médico.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleSolicitud = sequelize.define('DetalleSolicitud', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle'
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_solicitud'
  },
  id_insumo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_insumo'
  },
  cantidad_solicitada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  cantidad_despachada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  }
}, {
  tableName: 'detalle_solicitud',
  timestamps: false
});

module.exports = DetalleSolicitud;

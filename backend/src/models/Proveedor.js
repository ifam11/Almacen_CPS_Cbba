/**
 * @file Proveedor.js
 * @description Modelo de Proveedores farmacéuticos y suministros.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_proveedor'
  },
  nit_rut: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true
  },
  razon_social: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  contacto_nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: { isEmail: true }
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'proveedores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = Proveedor;

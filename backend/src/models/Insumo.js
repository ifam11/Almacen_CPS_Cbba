/**
 * @file Insumo.js
 * @description Catálogo de insumos con distinción entre SANITARIO (FEFO) y ADMINISTRATIVO (FIFO).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Insumo = sequelize.define('Insumo', {
  id_insumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_insumo'
  },
  codigo_institucional: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('SANITARIO', 'ADMINISTRATIVO'),
    allowNull: false,
    comment: 'SANITARIO aplica regla FEFO, ADMINISTRATIVO aplica regla FIFO'
  },
  unidad_medida: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  punto_reorden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25
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
  tableName: 'insumos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = Insumo;

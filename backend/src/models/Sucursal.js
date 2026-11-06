/**
 * @file Sucursal.js
 * @description Modelo Sequelize para Sucursales y Red Hospitalaria de la CPS Regional Cochabamba.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sucursal = sequelize.define('Sucursal', {
  id_sucursal: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  categoria: {
    type: DataTypes.ENUM('HOSPITALARIO', 'CONSULTA EXTERNA', 'ALTA ESPECIALIDAD', 'ADMINISTRATIVO'),
    defaultValue: 'CONSULTA EXTERNA'
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  zona: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefonos: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  horario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fuente_texto: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  fuente_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'Operativo'
  },
  servicios: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sucursales',
  timestamps: true,
  paranoid: true, // Soft delete con deletedAt
  underscored: true
});

module.exports = Sucursal;

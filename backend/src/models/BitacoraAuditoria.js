/**
 * @file BitacoraAuditoria.js
 * @description Modelo inmutable para registrar todas las operaciones de modificación del sistema.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BitacoraAuditoria = sequelize.define('BitacoraAuditoria', {
  id_auditoria: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_auditoria'
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_usuario'
  },
  accion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tabla_afectada: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  registro_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  valores_anteriores: {
    type: DataTypes.JSON,
    allowNull: true
  },
  valores_nuevos: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'bitacora_auditoria',
  timestamps: false,
  hooks: {
    // Garantía estricta de inmutabilidad: no se permite actualizar ni borrar
    beforeUpdate: () => {
      throw new Error('Inmutabilidad Violada: Los registros de la bitácora de auditoría no pueden ser alterados.');
    },
    beforeDestroy: () => {
      throw new Error('Inmutabilidad Violada: Los registros de la bitácora de auditoría no pueden ser eliminados.');
    }
  }
});

module.exports = BitacoraAuditoria;

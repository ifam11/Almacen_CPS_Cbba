/**
 * @file Usuario.js
 * @description Modelo de Usuario con borrado lógico (paranoid), hash de contraseña y relaciones RBAC.
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_usuario'
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_rol'
  },
  nombre_completo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(30),
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
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password_hash && !usuario.password_hash.startsWith('$2a$') && !usuario.password_hash.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password_hash') && !usuario.password_hash.startsWith('$2a$') && !usuario.password_hash.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
      }
    }
  }
});

/**
 * Método de instancia para verificar contraseñas de forma segura
 */
Usuario.prototype.validarPassword = async function (passwordPlano) {
  return await bcrypt.compare(passwordPlano, this.password_hash);
};

/**
 * Oculta campos sensibles al serializar a JSON
 */
Usuario.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

module.exports = Usuario;

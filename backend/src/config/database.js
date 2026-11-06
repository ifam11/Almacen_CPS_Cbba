/**
 * @file database.js
 * @description Configuración de conexión relacional a MySQL mediante Sequelize con soporte transaccional ACID.
 */

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'almacen_cps',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[SQL]: ${msg}`) : false,
    timezone: '-04:00', // Zona horaria estándar de Bolivia (La Paz / CPS)
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
      idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10)
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

module.exports = sequelize;

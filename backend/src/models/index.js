/**
 * @file index.js
 * @description Registro y configuración de asociaciones relacionales entre modelos Sequelize.
 */

const sequelize = require('../config/database');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const BitacoraAuditoria = require('./BitacoraAuditoria');
const Proveedor = require('./Proveedor');
const Insumo = require('./Insumo');
const Lote = require('./Lote');
const SolicitudDespacho = require('./SolicitudDespacho');
const DetalleSolicitud = require('./DetalleSolicitud');
const MovimientoKardex = require('./MovimientoKardex');
const Sucursal = require('./Sucursal');

// 1. Roles <-> Usuarios
Rol.hasMany(Usuario, { foreignKey: 'id_rol', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

// 2. Usuarios <-> BitacoraAuditoria
Usuario.hasMany(BitacoraAuditoria, { foreignKey: 'id_usuario', as: 'auditorias' });
BitacoraAuditoria.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// 3. Proveedores <-> Lotes
Proveedor.hasMany(Lote, { foreignKey: 'id_proveedor', as: 'lotes' });
Lote.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });

// 4. Insumos <-> Lotes
Insumo.hasMany(Lote, { foreignKey: 'id_insumo', as: 'lotes' });
Lote.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });

// 5. Solicitudes <-> Usuarios (Solicitante)
Usuario.hasMany(SolicitudDespacho, { foreignKey: 'id_usuario_solicitante', as: 'solicitudes' });
SolicitudDespacho.belongsTo(Usuario, { foreignKey: 'id_usuario_solicitante', as: 'solicitante' });

// 6. Solicitudes <-> DetalleSolicitud <-> Insumo
SolicitudDespacho.hasMany(DetalleSolicitud, { foreignKey: 'id_solicitud', as: 'detalles' });
DetalleSolicitud.belongsTo(SolicitudDespacho, { foreignKey: 'id_solicitud', as: 'solicitud' });
Insumo.hasMany(DetalleSolicitud, { foreignKey: 'id_insumo', as: 'detalles_solicitud' });
DetalleSolicitud.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });

// 7. Movimientos Kardex
Insumo.hasMany(MovimientoKardex, { foreignKey: 'id_insumo', as: 'movimientos_kardex' });
MovimientoKardex.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });

Lote.hasMany(MovimientoKardex, { foreignKey: 'id_lote', as: 'movimientos_kardex' });
MovimientoKardex.belongsTo(Lote, { foreignKey: 'id_lote', as: 'lote' });

Usuario.hasMany(MovimientoKardex, { foreignKey: 'id_usuario', as: 'movimientos_kardex' });
MovimientoKardex.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

SolicitudDespacho.hasMany(MovimientoKardex, { foreignKey: 'id_solicitud', as: 'movimientos_kardex' });
MovimientoKardex.belongsTo(SolicitudDespacho, { foreignKey: 'id_solicitud', as: 'solicitud' });

module.exports = {
  sequelize,
  Rol,
  Usuario,
  BitacoraAuditoria,
  Proveedor,
  Insumo,
  Lote,
  SolicitudDespacho,
  DetalleSolicitud,
  MovimientoKardex,
  Sucursal
};

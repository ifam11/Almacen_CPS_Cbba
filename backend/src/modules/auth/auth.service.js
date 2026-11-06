/**
 * @file auth.service.js
 * @description Capa de servicio para lógica de negocio de autenticación y gestión de credenciales.
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const { Usuario, Rol, BitacoraAuditoria } = require('../../models');

class AuthService {
  /**
   * Autenticación de usuarios institucionales con emisión de JWT
   */
  async login(email, password, ip = '127.0.0.1', userAgent = '') {
    if (!email || !password) {
      const err = new Error('Debe proporcionar el correo institucional y la contraseña.');
      err.statusCode = 400;
      throw err;
    }

    // Buscar usuario incluyendo su rol RBAC
    const usuario = await Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [{ model: Rol, as: 'rol', attributes: ['id_rol', 'nombre'] }]
    });

    if (!usuario) {
      const err = new Error('Credenciales incorrectas. Verifique correo y contraseña.');
      err.statusCode = 401;
      throw err;
    }

    if (!usuario.activo) {
      const err = new Error('Su cuenta se encuentra inactiva. Comuníquese con el Administrador de Sistemas CPS.');
      err.statusCode = 403;
      throw err;
    }

    // Validación criptográfica con Bcrypt
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      const err = new Error('Credenciales incorrectas. Verifique correo y contraseña.');
      err.statusCode = 401;
      throw err;
    }

    // Payload del JWT
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      nombre_completo: usuario.nombre_completo,
      id_rol: usuario.id_rol,
      rol: usuario.rol ? usuario.rol.nombre : 'Solicitante'
    };

    // Firma del token
    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
      algorithm: jwtConfig.algorithm
    });

    // Registrar inicio de sesión en Bitácora de Auditoría
    try {
      await BitacoraAuditoria.create({
        id_usuario: usuario.id_usuario,
        accion: 'LOGIN',
        tabla_afectada: 'usuarios',
        registro_id: String(usuario.id_usuario),
        valores_anteriores: null,
        valores_nuevos: { email: usuario.email, rol: payload.rol },
        ip: ip.replace('::ffff:', '').substring(0, 45),
        user_agent: (userAgent || 'Browser').substring(0, 255),
        fecha_hora: new Date()
      });
    } catch (auditErr) {
      console.warn('[LOGIN_AUDIT_WARNING]:', auditErr.message);
    }

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: payload.rol
      }
    };
  }

  /**
   * Obtiene la información del perfil del usuario autenticado
   */
  async getProfile(id_usuario) {
    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: ['id_usuario', 'nombre_completo', 'email', 'telefono', 'activo', 'created_at'],
      include: [{ model: Rol, as: 'rol', attributes: ['id_rol', 'nombre', 'descripcion'] }]
    });

    if (!usuario) {
      const err = new Error('Usuario no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    return usuario;
  }
}

module.exports = new AuthService();

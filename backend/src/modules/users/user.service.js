/**
 * @file user.service.js
 * @description Lógica de negocio para gestión de usuarios y asignación de roles RBAC.
 */

const { Usuario, Rol } = require('../../models');

class UserService {
  /**
   * Listar usuarios activos en el sistema
   */
  async getAllUsers() {
    return await Usuario.findAll({
      attributes: ['id_usuario', 'nombre_completo', 'email', 'telefono', 'activo', 'created_at'],
      include: [{ model: Rol, as: 'rol', attributes: ['id_rol', 'nombre', 'descripcion'] }],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Obtener detalle de usuario por ID
   */
  async getUserById(id) {
    const usuario = await Usuario.findByPk(id, {
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

  /**
   * Crear nuevo usuario hospitalario con validación de rol
   */
  async createUser(data) {
    const { nombre_completo, email, password, id_rol, telefono } = data;

    if (!nombre_completo || !email || !password || !id_rol) {
      const err = new Error('Los campos nombre_completo, email, password e id_rol son obligatorios.');
      err.statusCode = 400;
      throw err;
    }

    // Verificar si el rol existe
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      const err = new Error(`El rol especificado con ID ${id_rol} no es válido.`);
      err.statusCode = 400;
      throw err;
    }

    // Crear el usuario (el hook de Sequelize hasheará la contraseña con bcrypt)
    const nuevoUsuario = await Usuario.create({
      nombre_completo: nombre_completo.trim(),
      email: email.trim().toLowerCase(),
      password_hash: password,
      id_rol,
      telefono: telefono || null,
      activo: true
    });

    return await this.getUserById(nuevoUsuario.id_usuario);
  }

  /**
   * Actualizar usuario existente
   */
  async updateUser(id, data) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      const err = new Error('Usuario no encontrado para actualización.');
      err.statusCode = 404;
      throw err;
    }

    const camposActualizables = {};
    if (data.nombre_completo) camposActualizables.nombre_completo = data.nombre_completo.trim();
    if (data.email) camposActualizables.email = data.email.trim().toLowerCase();
    if (data.id_rol) {
      const rolExiste = await Rol.findByPk(data.id_rol);
      if (!rolExiste) {
        const err = new Error('El ID de rol proporcionado no existe.');
        err.statusCode = 400;
        throw err;
      }
      camposActualizables.id_rol = data.id_rol;
    }
    if (data.telefono !== undefined) camposActualizables.telefono = data.telefono;
    if (data.activo !== undefined) camposActualizables.activo = data.activo;
    if (data.password) camposActualizables.password_hash = data.password;

    await usuario.update(camposActualizables);

    return await this.getUserById(id);
  }

  /**
   * Baja lógica de usuario (Soft Delete)
   */
  async deleteUser(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      const err = new Error('Usuario no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    // Desactivar y soft-delete
    await usuario.update({ activo: false });
    await usuario.destroy();

    return { id_usuario: id, eliminado: true };
  }

  /**
   * Listar todos los roles del sistema
   */
  async getAllRoles() {
    return await Rol.findAll({
      order: [['id_rol', 'ASC']]
    });
  }
}

module.exports = new UserService();

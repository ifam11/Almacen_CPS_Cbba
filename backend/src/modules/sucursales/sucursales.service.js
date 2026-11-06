/**
 * @file sucursales.service.js
 * @description Servicio de lógica de negocio para el CRUD de Sucursales y Centros de Salud CPS.
 */

const { Op } = require('sequelize');
const { Sucursal } = require('../../models');

const SUCURSALES_INICIALES = [
  {
    nombre: 'Administración Departamental CPS',
    tipo: 'Oficinas Administrativas',
    categoria: 'ADMINISTRATIVO',
    direccion: 'Calle General Achá, esquina Junín, N.º O-0186',
    zona: 'Centro Histórico - Cochabamba',
    telefonos: '458-5728 / 458-5729',
    correo: 'admin.cbba@cps.org.bo',
    horario: 'Lunes a Viernes: 08:00 - 16:00',
    fuente_texto: 'Sitio oficial de la CPS Cochabamba',
    fuente_url: 'https://cbba.cps.org.bo/',
    estado: 'Operativo',
    servicios: 'Gerencia Regional, Jefatura Médica, Gestión de Almacenes, Adquisiciones'
  },
  {
    nombre: 'Hospital Elizabeth Seton',
    tipo: 'Centro Hospitalario de Tercer Nivel',
    categoria: 'HOSPITALARIO',
    direccion: 'Avenida Blanco Galindo, km 5½',
    zona: 'Colcapirhua / Av. Blanco Galindo',
    telefonos: '424-0205',
    correo: 'hosp.seton@cps.org.bo',
    horario: 'Atención Continua: 24 Horas / 365 Días',
    fuente_texto: 'Sitio oficial de la CPS Cochabamba',
    fuente_url: 'https://cbba.cps.org.bo/',
    estado: 'Operativo 24/7',
    servicios: 'Emergencias, Quirófano, Terapia Intensiva (UTI), Farmacia Central, Internación'
  },
  {
    nombre: 'Policlínico Central',
    tipo: 'Consulta Externa y Especialidades',
    categoria: 'CONSULTA EXTERNA',
    direccion: 'Calle Bolívar E-0502, esquina avenida San Martín',
    zona: 'Zona Central - Cochabamba',
    telefonos: '422-9504 / 422-9505 / 422-4433',
    correo: 'policlinico.central@cps.org.bo',
    horario: 'Lunes a Sábado: 07:00 - 19:00',
    fuente_texto: 'Sitio oficial de la CPS Cochabamba',
    fuente_url: 'https://cbba.cps.org.bo/',
    estado: 'Operativo',
    servicios: 'Medicina General, Especialidades Médicas, Laboratorio Clínico, Dispensación Farmacéutica'
  },
  {
    nombre: 'Policonsultorio Norte',
    tipo: 'Atención Primaria y Ambulatoria',
    categoria: 'CONSULTA EXTERNA',
    direccion: 'Calle Julio Méndez N.º 1347-A, casi Obispo Anaya',
    zona: 'Zona Norte / Cala Cala',
    telefonos: '443-3586',
    correo: 'polinorte@cps.org.bo',
    horario: 'Lunes a Viernes: 07:30 - 18:30',
    fuente_texto: 'Sitio oficial de la CPS Cochabamba',
    fuente_url: 'https://cbba.cps.org.bo/',
    estado: 'Operativo',
    servicios: 'Medicina Familiar, Odontología, Pediatría, Farmacia Satélite'
  },
  {
    nombre: 'Instituto Oncológico Nacional',
    tipo: 'Centro Especializado de Oncología',
    categoria: 'ALTA ESPECIALIDAD',
    direccion: 'Avenida Maltería Linde, esquina avenida Ecológica, zona Linde, Tiquipaya',
    zona: 'Linde - Tiquipaya',
    telefonos: '428-8039 / 428-8754',
    correo: 'oncologico.nacional@cps.org.bo',
    horario: 'Lunes a Viernes: 08:00 - 16:30',
    fuente_texto: 'Plan Estratégico Institucional de la CPS',
    fuente_url: 'https://www.cps.org.bo/sites/default/files/PEI%202021-2025%20CPS%207V.pdf',
    estado: 'Operativo Especializado',
    servicios: 'Quimioterapia, Radioterapia, Oncología Clínica, Farmacia Oncológica'
  }
];

class SucursalesService {
  /**
   * Sembrado automático inicial si la tabla está vacía
   */
  async seedIfEmpty() {
    try {
      const count = await Sucursal.count();
      if (count === 0) {
        await Sucursal.bulkCreate(SUCURSALES_INICIALES);
        console.log('[SEED_SUCURSALES]: Se insertaron las 5 sucursales oficiales de CPS CBBA.');
      }
    } catch (err) {
      console.warn('[SEED_SUCURSALES_WARN]:', err.message);
    }
  }

  /**
   * Lista todas las sucursales con soporte de búsqueda y filtrado
   */
  async getAllSucursales(query = {}) {
    await this.seedIfEmpty();

    const { search, categoria, estado } = query;
    const where = {};

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { nombre: { [Op.like]: term } },
        { direccion: { [Op.like]: term } },
        { zona: { [Op.like]: term } },
        { tipo: { [Op.like]: term } }
      ];
    }

    if (categoria && categoria !== 'TODOS') {
      where.categoria = categoria;
    }

    if (estado) {
      where.estado = estado;
    }

    return await Sucursal.findAll({
      where,
      order: [['id_sucursal', 'ASC']]
    });
  }

  /**
   * Obtiene una sucursal por su identificador primario
   */
  async getSucursalById(id) {
    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) {
      const error = new Error(`La sucursal con ID ${id} no existe.`);
      error.statusCode = 404;
      throw error;
    }
    return sucursal;
  }

  /**
   * Crea una nueva sucursal con validaciones
   */
  async createSucursal(data) {
    const { nombre, tipo, direccion } = data;
    if (!nombre || !tipo || !direccion) {
      const error = new Error('Los campos nombre, tipo y dirección son estrictamente obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    return await Sucursal.create({
      nombre: data.nombre.trim(),
      tipo: data.tipo.trim(),
      categoria: data.categoria || 'CONSULTA EXTERNA',
      direccion: data.direccion.trim(),
      zona: data.zona ? data.zona.trim() : null,
      telefonos: data.telefonos ? data.telefonos.trim() : null,
      correo: data.correo ? data.correo.trim() : null,
      horario: data.horario ? data.horario.trim() : 'Lunes a Viernes: 08:00 - 16:00',
      fuente_texto: data.fuente_texto ? data.fuente_texto.trim() : 'Sitio oficial CPS Cochabamba',
      fuente_url: data.fuente_url ? data.fuente_url.trim() : 'https://cbba.cps.org.bo/',
      estado: data.estado || 'Operativo',
      servicios: data.servicios ? data.servicios.trim() : null
    });
  }

  /**
   * Actualiza los datos de una sucursal existente
   */
  async updateSucursal(id, data) {
    const sucursal = await this.getSucursalById(id);

    await sucursal.update({
      nombre: data.nombre !== undefined ? data.nombre.trim() : sucursal.nombre,
      tipo: data.tipo !== undefined ? data.tipo.trim() : sucursal.tipo,
      categoria: data.categoria !== undefined ? data.categoria : sucursal.categoria,
      direccion: data.direccion !== undefined ? data.direccion.trim() : sucursal.direccion,
      zona: data.zona !== undefined ? data.zona.trim() : sucursal.zona,
      telefonos: data.telefonos !== undefined ? data.telefonos.trim() : sucursal.telefonos,
      correo: data.correo !== undefined ? data.correo.trim() : sucursal.correo,
      horario: data.horario !== undefined ? data.horario.trim() : sucursal.horario,
      fuente_texto: data.fuente_texto !== undefined ? data.fuente_texto.trim() : sucursal.fuente_texto,
      fuente_url: data.fuente_url !== undefined ? data.fuente_url.trim() : sucursal.fuente_url,
      estado: data.estado !== undefined ? data.estado : sucursal.estado,
      servicios: data.servicios !== undefined ? data.servicios.trim() : sucursal.servicios
    });

    return sucursal;
  }

  /**
   * Elimina suavemente (soft delete) una sucursal
   */
  async deleteSucursal(id) {
    const sucursal = await this.getSucursalById(id);
    await sucursal.destroy();
    return { id_sucursal: id, eliminado: true };
  }
}

module.exports = new SucursalesService();

/**
 * @file seed.js
 * @description Script para inicializar automáticamente la base de datos 'almacen_cps', sincronizar
 * modelos relacionales y registrar datos maestros de Roles, Usuarios, Proveedores, Insumos, Lotes y Kardex.
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function ensureDatabaseExists() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'almacen_cps';

  console.log(`[SEED]: Verificando existencia de la base de datos '${dbName}' en MySQL (${host}:${port})...`);
  const conn = await mysql.createConnection({ host, port, user, password });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  console.log(`[SEED]: Base de datos '${dbName}' lista y configurada.`);
  await conn.end();
}

async function runSeed() {
  try {
    // 0. Asegurar que la base de datos exista antes de conectar Sequelize
    await ensureDatabaseExists();

    const {
      sequelize,
      Rol,
      Usuario,
      Proveedor,
      Insumo,
      Lote,
      MovimientoKardex
    } = require('../models');

    console.log('[SEED]: Conectando con Sequelize...');
    await sequelize.authenticate();
    console.log('[SEED]: Conexión exitosa. Sincronizando modelos relacionales...');

    await sequelize.sync({ alter: false });
    console.log('[SEED]: Esquemas sincronizados.');

    // 1. Roles RBAC
    console.log('[SEED]: Poblando roles institucionales...');
    const rolesData = [
      { id_rol: 1, nombre: 'Administrador', descripcion: 'Acceso total y configuración del ecosistema hospitalario' },
      { id_rol: 2, nombre: 'Gerente', descripcion: 'Visualización de dashboards, auditoría y reportes gerenciales' },
      { id_rol: 3, nombre: 'Encargado', descripcion: 'Gestión de catálogo, recepción de lotes y emisión de QR' },
      { id_rol: 4, nombre: 'Operario', descripcion: 'Uso móvil en pasillo: Escaneo de QR, picking y confirmación FEFO/FIFO' },
      { id_rol: 5, nombre: 'Solicitante', descripcion: 'Personal de salas y servicios médicos que solicita material' }
    ];

    for (const r of rolesData) {
      await Rol.findOrCreate({
        where: { id_rol: r.id_rol },
        defaults: r
      });
    }

    // 2. Usuarios Base (Contraseña: Admin123*)
    console.log('[SEED]: Registrando usuarios del personal CPS con hash Bcrypt...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin123*', salt);

    const usuariosData = [
      {
        id_usuario: 1,
        id_rol: 1,
        nombre_completo: 'Administrador Central CPS',
        email: 'admin@cps.gob.bo',
        password_hash: passwordHash,
        telefono: '+591 2 2223344',
        activo: true
      },
      {
        id_usuario: 2,
        id_rol: 2,
        nombre_completo: 'Dra. María Elena Prado',
        email: 'gerencia@cps.gob.bo',
        password_hash: passwordHash,
        telefono: '+591 2 2223345',
        activo: true
      },
      {
        id_usuario: 3,
        id_rol: 3,
        nombre_completo: 'Lic. Carlos Mendoza',
        email: 'encargado@cps.gob.bo',
        password_hash: passwordHash,
        telefono: '+591 2 2223346',
        activo: true
      },
      {
        id_usuario: 4,
        id_rol: 4,
        nombre_completo: 'Juan Pérez (Operario Pasillo)',
        email: 'operario@cps.gob.bo',
        password_hash: passwordHash,
        telefono: '+591 2 2223347',
        activo: true
      },
      {
        id_usuario: 5,
        id_rol: 5,
        nombre_completo: 'Enf. Patricia Ruiz (Emergencias)',
        email: 'solicitante@cps.gob.bo',
        password_hash: passwordHash,
        telefono: '+591 2 2223348',
        activo: true
      }
    ];

    for (const u of usuariosData) {
      const existe = await Usuario.findOne({ where: { email: u.email } });
      if (!existe) {
        await Usuario.create(u);
      }
    }

    // 3. Proveedores
    console.log('[SEED]: Registrando proveedores farmacéuticos y suministros...');
    const proveedoresData = [
      {
        id_proveedor: 1,
        nit_rut: '1020304050',
        razon_social: 'Droguería INTI S.A.',
        contacto_nombre: 'Lic. Roberto Vargas',
        telefono: '+591 2 2456789',
        email: 'ventas@drogueriainti.bo',
        direccion: 'Av. Busch #1234, La Paz',
        activo: true
      },
      {
        id_proveedor: 2,
        nit_rut: '2030405060',
        razon_social: 'Laboratorios Bagó de Bolivia',
        contacto_nombre: 'Dra. Sandra Quispe',
        telefono: '+591 2 2789123',
        email: 'pedidos@bago.com.bo',
        direccion: 'Calle 21 de Calacoto #45, La Paz',
        activo: true
      },
      {
        id_proveedor: 3,
        nit_rut: '3040506070',
        razon_social: 'Papelería y Suministros La Paz S.R.L.',
        contacto_nombre: 'Sr. Marco Morales',
        telefono: '+591 2 2334455',
        email: 'contacto@papelerialapaz.bo',
        direccion: 'Av. 6 de Agosto #890, La Paz',
        activo: true
      }
    ];

    for (const prov of proveedoresData) {
      await Proveedor.findOrCreate({
        where: { nit_rut: prov.nit_rut },
        defaults: prov
      });
    }

    // 4. Insumos (Sanitarios FEFO y Administrativos FIFO)
    console.log('[SEED]: Registrando catálogo de insumos médicos...');
    const insumosData = [
      {
        id_insumo: 1,
        codigo_institucional: 'MED-AMOX-500',
        nombre: 'Amoxicilina 500mg',
        descripcion: 'Antibiótico betalactámico en cápsulas',
        tipo: 'SANITARIO',
        unidad_medida: 'Caja x 100',
        stock_minimo: 30,
        punto_reorden: 60,
        activo: true
      },
      {
        id_insumo: 2,
        codigo_institucional: 'MED-PARAC-1G',
        nombre: 'Paracetamol 1g Inyectable',
        descripcion: 'Solución para perfusión intravenosa',
        tipo: 'SANITARIO',
        unidad_medida: 'Frasco',
        stock_minimo: 50,
        punto_reorden: 100,
        activo: true
      },
      {
        id_insumo: 3,
        codigo_institucional: 'MAT-JERING-5ML',
        nombre: 'Jeringa Desechable 5ml c/ Aguja',
        descripcion: 'Material sanitario estéril descartable',
        tipo: 'SANITARIO',
        unidad_medida: 'Caja x 100',
        stock_minimo: 40,
        punto_reorden: 80,
        activo: true
      },
      {
        id_insumo: 4,
        codigo_institucional: 'ADM-PAPEL-BOND',
        nombre: 'Papel Bond Carta 75g',
        descripcion: 'Hojas resma para formularios médicos',
        tipo: 'ADMINISTRATIVO',
        unidad_medida: 'Resma',
        stock_minimo: 20,
        punto_reorden: 50,
        activo: true
      },
      {
        id_insumo: 5,
        codigo_institucional: 'ADM-TONER-HP',
        nombre: 'Tóner HP LaserJet 85A',
        descripcion: 'Suministro para impresoras de recepción',
        tipo: 'ADMINISTRATIVO',
        unidad_medida: 'Unidad',
        stock_minimo: 5,
        punto_reorden: 12,
        activo: true
      }
    ];

    for (const ins of insumosData) {
      await Insumo.findOrCreate({
        where: { codigo_institucional: ins.codigo_institucional },
        defaults: ins
      });
    }

    // 5. Lotes Demostrativos con Códigos QR y Estados para FEFO/FIFO
    console.log('[SEED]: Registrando lotes iniciales y semáforos de caducidad...');
    const lotesData = [
      {
        id_lote: 1,
        id_insumo: 1,
        id_proveedor: 1,
        numero_lote: 'INTI-AMOX-2026-X1',
        codigo_qr: 'CPS-LOT-1-M1A8Z9-71E3',
        cantidad_inicial: 350,
        cantidad_actual: 350,
        costo_unitario: 85.00,
        fecha_ingreso: new Date(Date.now() - 3600000 * 24 * 30),
        fecha_vencimiento: '2026-10-25', // Caduca en 11 días -> Alerta Roja Crítica (<30d) y Prioritario FEFO!
        estado: 'DISPONIBLE',
        ubicacion_pasillo: 'Pasillo 1, Estante A, Nivel 1'
      },
      {
        id_lote: 2,
        id_insumo: 1,
        id_proveedor: 1,
        numero_lote: 'INTI-AMOX-2026-X2',
        codigo_qr: 'CPS-LOT-1-M2B9Y8-82F4',
        cantidad_inicial: 500,
        cantidad_actual: 500,
        costo_unitario: 85.00,
        fecha_ingreso: new Date(Date.now() - 3600000 * 24 * 5),
        fecha_vencimiento: '2027-04-15', // Vence después -> Si se escanea, ¡provoca HTTP 403 FEFO!
        estado: 'DISPONIBLE',
        ubicacion_pasillo: 'Pasillo 1, Estante B, Nivel 2'
      },
      {
        id_lote: 3,
        id_insumo: 2,
        id_proveedor: 2,
        numero_lote: 'BAGO-PARAC-2026-03',
        codigo_qr: 'CPS-LOT-2-K9B2X1-44FA',
        cantidad_inicial: 850,
        cantidad_actual: 850,
        costo_unitario: 15.00,
        fecha_ingreso: new Date(Date.now() - 3600000 * 24 * 15),
        fecha_vencimiento: '2026-11-05', // Caduca en 22 días -> Alerta Roja
        estado: 'DISPONIBLE',
        ubicacion_pasillo: 'Pasillo 2, Estante C, Nivel 2'
      },
      {
        id_lote: 4,
        id_insumo: 3,
        id_proveedor: 2,
        numero_lote: 'MAT-JERING-26-B',
        codigo_qr: 'CPS-LOT-4-L4M5N6-99DF',
        cantidad_inicial: 600,
        cantidad_actual: 600,
        costo_unitario: 20.00,
        fecha_ingreso: new Date(Date.now() - 3600000 * 24 * 20),
        fecha_vencimiento: '2026-12-08', // Caduca en 55 días -> Alerta Amarilla (<60d)
        estado: 'DISPONIBLE',
        ubicacion_pasillo: 'Pasillo 3, Estante A, Nivel 1'
      },
      {
        id_lote: 5,
        id_insumo: 4,
        id_proveedor: 3,
        numero_lote: 'PAPEL-LOTE-2026-01',
        codigo_qr: 'CPS-LOT-4-P1Q2R3-11AA',
        cantidad_inicial: 50,
        cantidad_actual: 50,
        costo_unitario: 35.00,
        fecha_ingreso: new Date(Date.now() - 3600000 * 24 * 45),
        fecha_vencimiento: '2028-12-31',
        estado: 'DISPONIBLE',
        ubicacion_pasillo: 'Pasillo Administrativo, Estante 1'
      }
    ];

    for (const l of lotesData) {
      const [loteCreado, fueCreado] = await Lote.findOrCreate({
        where: { codigo_qr: l.codigo_qr },
        defaults: l
      });

      // Si fue creado, registrar en Kardex como movimiento inmutable de INGRESO
      if (fueCreado) {
        await MovimientoKardex.create({
          id_insumo: loteCreado.id_insumo,
          id_lote: loteCreado.id_lote,
          id_usuario: 1,
          id_solicitud: null,
          tipo_movimiento: 'INGRESO',
          cantidad: loteCreado.cantidad_inicial,
          saldo_lote_resultante: loteCreado.cantidad_actual,
          costo_unitario: loteCreado.costo_unitario,
          costo_total: parseFloat((loteCreado.cantidad_inicial * loteCreado.costo_unitario).toFixed(2)),
          fecha_movimiento: loteCreado.fecha_ingreso,
          observaciones: `Carga inicial de lote ${loteCreado.numero_lote}`
        });
      }
    }

    console.log('[SEED_COMPLETO]: Base de datos inicializada con Roles, Usuarios, Insumos, Lotes, QR y Kardex.');
    process.exit(0);
  } catch (error) {
    console.error('[SEED_ERROR]: Ocurrió un error al ejecutar los seeds:', error);
    process.exit(1);
  }
}

runSeed();

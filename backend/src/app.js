/**
 * @file app.js
 * @description Configuración de la aplicación Express, middlewares globales y enrutador principal.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const auditLogger = require('./middlewares/auditMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const ResponseHandler = require('./utils/responseHandler');

// Rutas de Módulo 1: Seguridad, RBAC y Auditoría
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const auditRoutes = require('./modules/audit/audit.routes');

// Rutas de Módulo 2: Catálogo y Recepción por Lotes con QR
const supplierRoutes = require('./modules/suppliers/supplier.routes');
const itemRoutes = require('./modules/items/item.routes');
const receptionRoutes = require('./modules/reception/reception.routes');

// Rutas de Módulo 3: Logística y Despacho Móvil (FEFO/FIFO)
const dispatchRoutes = require('./modules/dispatch/dispatch.routes');

// Rutas de Módulo 4: Dashboard y Alertas Gerenciales
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

// Rutas de Módulo 5: Inteligencia Artificial Predictiva (Random Forest / ROP)
const aiRoutes = require('./modules/ai/ai.routes');

// Rutas de Módulo 6: Sucursales y Centros de Salud CPS (CRUD)
const sucursalesRoutes = require('./modules/sucursales/sucursales.routes');
const dispatchController = require('./modules/dispatch/dispatch.controller');

const app = express();

// 1. Middlewares de Seguridad y Parsing
app.use(helmet());
app.use(cors({
  origin: '*', // Configurable para aceptar Frontend Web (Vite) y Móvil (React Native)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// 2. Middleware de Auditoría Inmutable (Intercepta automáticamente POST, PUT, DELETE)
app.use(auditLogger);

// 3. Endpoint de Salud del Sistema
app.get('/api/v1/health', (req, res) => {
  return ResponseHandler.success(res, {
    status: 'ONLINE',
    servicio: 'Almacén Central CPS - API RESTful',
    timestamp: new Date().toISOString()
  }, 'Servidor en operación normal');
});

// 4. Registro de Rutas Modulares
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', userRoutes);
app.use('/api/v1/auditoria', auditRoutes);
app.use('/api/v1/proveedores', supplierRoutes);
app.use('/api/v1/insumos', itemRoutes);
app.use('/api/v1/recepcion', receptionRoutes);
app.use('/api/v1/despacho', dispatchRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/ia', aiRoutes);
app.use('/api/ia', aiRoutes);

// 5. CRUD de Sucursales y Centros de Salud CPS Regional Cochabamba
app.use('/api/v1/sucursales', sucursalesRoutes);
app.use('/api/sucursales', sucursalesRoutes);

// 6. Endpoints solicitados directamente: Escaneo QR y Despacho FEFO/FIFO
app.get('/api/lote/escanear/:codigoQR', dispatchController.escanearLote);
app.get('/api/v1/lote/escanear/:codigoQR', dispatchController.escanearLote);
app.post('/api/despacho', dispatchController.ejecutarDespacho);

// 7. Manejo de Rutas No Encontradas (404)
app.use('*', (req, res) => {
  return ResponseHandler.notFound(res, `La ruta solicitada [${req.method} ${req.originalUrl}] no existe.`);
});

// 6. Middleware Global de Excepciones
app.use(errorHandler);

module.exports = app;

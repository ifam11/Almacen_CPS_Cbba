/**
 * @file server.js
 * @description Punto de entrada para arranque del servidor HTTP y sincronización de base de datos.
 */

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('[STARTUP]: Verificando conexión transaccional con MySQL...');
    await sequelize.authenticate();
    console.log('[STARTUP]: Conexión exitosa a la base de datos MySQL (almacen_cps).');

    // Sincronización de modelos en modo no destructivo
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('[STARTUP]: Modelos relacionales sincronizados.');
    }

    const server = app.listen(PORT, () => {
      console.log(`[CPS_ALMACEN_API]: Servidor activo escuchando en http://localhost:${PORT}`);
      console.log(`[HEALTH_CHECK]: http://localhost:${PORT}/api/v1/health`);
    });

    // Manejo de apagado elegante (Graceful Shutdown)
    const shutdown = async (signal) => {
      console.log(`\n[SHUTDOWN]: Recibida señal ${signal}. Cerrando conexiones...`);
      server.close(async () => {
        try {
          await sequelize.close();
          console.log('[SHUTDOWN]: Conexión a base de datos cerrada.');
          process.exit(0);
        } catch (err) {
          console.error('[SHUTDOWN_ERROR]: Error al cerrar DB:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('[STARTUP_FATAL_ERROR]: No se pudo conectar a la base de datos MySQL:', error.message);
    console.warn('[INFO]: Asegúrate de que el servicio MySQL esté iniciado y configurado en tu archivo .env');
    // Iniciamos el servidor de todos modos para permitir pruebas y diagnóstico de rutas
    app.listen(PORT, () => {
      console.log(`[CPS_ALMACEN_API]: Servidor escuchando en http://localhost:${PORT} (Modo degradado sin DB activa)`);
    });
  }
}

startServer();

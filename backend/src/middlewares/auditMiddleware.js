/**
 * @file auditMiddleware.js
 * @description Middleware para registrar automáticamente en 'BitacoraAuditoria'
 * cualquier mutación de estado del sistema (POST, PUT, PATCH, DELETE).
 * Garantiza trazabilidad inmutable y forense con IP, Usuario, Acción y Tabla.
 */

const { BitacoraAuditoria } = require('../models');

/**
 * Mapeo de prefijos de ruta a tablas relacionales de la base de datos
 */
const inferirTablaAfectada = (url) => {
  const cleanPath = url.split('?')[0].toLowerCase();
  if (cleanPath.includes('/insumos')) return 'insumos';
  if (cleanPath.includes('/lotes')) return 'lotes';
  if (cleanPath.includes('/proveedores')) return 'proveedores';
  if (cleanPath.includes('/usuarios')) return 'usuarios';
  if (cleanPath.includes('/solicitudes')) return 'solicitudes_despacho';
  if (cleanPath.includes('/despacho')) return 'movimiento_kardex';
  if (cleanPath.includes('/kardex')) return 'movimiento_kardex';
  if (cleanPath.includes('/auth/login')) return 'usuarios (login)';
  if (cleanPath.includes('/roles')) return 'roles';
  return 'general';
};

const auditLogger = (req, res, next) => {
  // Solo auditar métodos que mutan datos
  const metodosMutables = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!metodosMutables.includes(req.method)) {
    return next();
  }

  // Interceptar la finalización de la respuesta para registrar el estado resultante
  res.on('finish', async () => {
    // Solo auditar si la operación fue exitosa (códigos 2xx o 3xx)
    if (res.statusCode >= 200 && res.statusCode < 400) {
      try {
        // Extracción de IP compatible con proxies y localhost
        let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
        if (typeof rawIp === 'string' && rawIp.includes(',')) {
          rawIp = rawIp.split(',')[0].trim();
        }
        const ip = rawIp.replace('::ffff:', '');

        // Obtener ID de usuario (si ya está autenticado)
        const id_usuario = req.user ? req.user.id_usuario : (res.locals.auditUserId || null);

        // Permitir que el controlador defina metadatos específicos o inferir por defecto
        const customAudit = res.locals.auditLog || {};
        const tabla_afectada = customAudit.tabla_afectada || inferirTablaAfectada(req.originalUrl);
        const accion = customAudit.accion || req.method;
        const registro_id = customAudit.registro_id || req.params.id || res.locals.createdId || null;

        // Limpiar contraseñas o datos sensibles antes de almacenar en el log
        let valoresNuevos = null;
        if (req.body && Object.keys(req.body).length > 0) {
          valoresNuevos = { ...req.body };
          if (valoresNuevos.password) delete valoresNuevos.password;
          if (valoresNuevos.password_hash) delete valoresNuevos.password_hash;
        }

        await BitacoraAuditoria.create({
          id_usuario,
          accion,
          tabla_afectada,
          registro_id: registro_id ? String(registro_id) : null,
          valores_anteriores: customAudit.valores_anteriores || null,
          valores_nuevos: customAudit.valores_nuevos || valoresNuevos,
          ip: ip.substring(0, 45),
          user_agent: req.headers['user-agent'] ? req.headers['user-agent'].substring(0, 255) : 'Desconocido',
          fecha_hora: new Date()
        });
      } catch (err) {
        // La falla en auditoría nunca interrumpe la respuesta HTTP enviada al cliente, pero se reporta en consola
        console.error('[AUDIT_LOGGER_FATAL_ERROR]: No se pudo persistir el registro de auditoría:', err.message);
      }
    }
  });

  next();
};

module.exports = auditLogger;

# Reglas de Seguridad Sanitaria y Cumplimiento FEFO / FIFO

Estas reglas aplican de forma obligatoria en todo el ecosistema de la Caja Petrolera de Salud (CPS Cochabamba):

1. **Prioridad Sanitaria Absoluta:**
   * La fecha de caducidad (`fecha_vencimiento`) es el atributo rector para cualquier insumo clasificado como `tipo = 'sanitario'`.
   * Bajo ninguna circunstancia se debe permitir omitir o sobrepasar la validación FEFO en controladores de backend o vistas frontend.

2. **Integridad de Datos Inmutable:**
   * Las tablas `movimientos_kardex` y `bitacora_auditoria` son estrictamente *Append-Only*.
   * Cualquier corrección contable debe generar un nuevo registro de contra-asiento o ajuste justificado, nunca modificar un registro existente.

3. **Protección de Credenciales y Secretos:**
   * Los archivos `.env` reales jamás deben subirse al repositorio Git.
   * Toda variable sensible debe leerse mediante `process.env` en Node.js o `os.getenv` en Python.
   * Las contraseñas de usuarios deben hashearse con `bcrypt` y nunca devolverse en respuestas HTTP o logs de consola.

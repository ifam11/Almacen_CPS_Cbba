# AGENTS.md — Reglas y Guías Maestras del Proyecto Almacén CPS Cochabamba

Este archivo contiene las directrices de desarrollo, arquitectura y seguridad obligatorias para cualquier agente de inteligencia artificial (Antigravity/Gemini) o desarrollador que trabaje en el repositorio **Almacen_CPS_Cbba** (Caja Petrolera de Salud - Cochabamba).

---

## 1. Identidad y Contexto del Proyecto

* **Institución:** Caja Petrolera de Salud (CPS), Regional Cochabamba, Bolivia.
* **Misión del Software:** Control integral, trazabilidad inmutable y pronóstico inteligente de inventarios hospitalarios (medicamentos, reactivos de laboratorio, material médico quirúrgico y suministros administrativos).
* **Zona Horaria Oficial:** `America/La_Paz` (`UTC -04:00`).
* **Moneda del Sistema:** Bolivianos (`Bs.` / `BOB`).
* **Enfoque de Seguridad:** Cero tolerancia a pérdida o sobreescritura de datos contables; cumplimiento sanitario riguroso.

---

## 2. Principios Arquitectónicos Innegociables

### A. Rotación Estricta: FEFO y FIFO
1. **Insumos Sanitarios / Médicos (`tipo = 'sanitario'`):**
   * Se rigen obligatoriamente por **FEFO (First Expired, First Out)**.
   * La API **DEBE** bloquear con código HTTP `403 Forbidden` cualquier intento de despachar un lote si existe otro lote activo del mismo insumo con fecha de vencimiento anterior y existencias mayores a 0.
   * La respuesta `403` debe incluir la información del lote obligatorio para guiar al operario en pasillo.
2. **Insumos Administrativos (`tipo = 'administrativo'`):**
   * Se rigen por **FIFO (First In, First Out)** según la fecha cronológica de recepción en almacén.

### B. Inmutabilidad Contable (Append-Only)
* Las tablas y modelos `MovimientoKardex` y `BitacoraAuditoria` son **estrictamente de inserción (Append-Only)**.
* **PROHIBIDO:** Sentencias `UPDATE` o `DELETE` directas sobre Kardex o Bitácora.
* Cualquier ajuste de inventario (mermas, roturas, vencidos, devoluciones) se registra como un nuevo movimiento contable con signo negativo o tipo de ajuste correspondiente.

### C. Transaccionalidad ACID en Despachos y Recepciones
* Toda operación que afecte el stock de un lote **DEBE** ejecutarse dentro de una transacción Sequelize (`sequelize.transaction()`).
* El flujo atómico obligatorio es:
  1. Validar regla FEFO/FIFO.
  2. Descontar o incrementar `stock_actual` en tabla `lotes`.
  3. Insertar el asiento en `movimientos_kardex`.
  4. Actualizar estado de solicitud en `solicitudes_despacho`.
  5. Registrar evento en `bitacora_auditoria`.
  6. Si cualquier paso falla, realizar `ROLLBACK` completo.

---

## 3. Estándares de Código por Módulo

### Backend (`Node.js + Express + Sequelize`)
* **Clean Architecture:** Separación clara en `routes -> controllers -> services -> models -> utils`.
* **Formato de Respuesta Estandarizado:**
  * Éxito: `{ success: true, data: ..., message: '...' }`
  * Error: `{ success: false, message: '...', error: '...', code: '...' }`
* **Manejo de Errores:** Todos los controladores deben utilizar bloques `try/catch` delegando al middleware centralizado `errorHandler.js`.
* **Seguridad:**
  * Hasheo obligatorio de contraseñas con `bcrypt` (factor de costo mínimo 10).
  * Autenticación basada en JWT (`Bearer <token>`).
  * Validación estricta de Roles RBAC (`ADMINISTRADOR`, `GERENTE`, `ENCARGADO`, `OPERARIO`, `SOLICITANTE`).

### Frontend Web (`React + Vite + TailwindCSS`)
* **Propósito:** Portal gerencial y administrativo.
* **Dashboard:** Visualización clara de semáforo de vencimientos (<30 días en rojo, <60 días en amarillo), valorización monetaria de inventario y punto de reorden (ROP).
* **Diseño:** Limpio, institucional, responsivo y con soporte para reportes e impresión térmica de códigos QR.

### Frontend Mobile (`React Native + Expo`)
* **Propósito:** Aplicación nativa para operarios de pasillo en almacén central.
* **Componentes Clave:**
  * Escáner QR de alto rendimiento en pasillos hospitalarios.
  * Modal visual de advertencia FEFO en rojo ante bloqueos sanitarios (`FefoAlertModal`).
  * Botones grandes y accesibles con retroalimentación háptica y visual.

### Servicio de IA (`Python 3 + Scikit-Learn`)
* **Modelo:** Random Forest Regressor para predicción mensual de demanda hospitalaria.
* **Ingeniería de Características:** Lags temporales ($t-1 \dots t-7$), medias móviles de 7 y 30 días, y estacionalidad.
* **Cálculo de Reorden:**
  $$ROP = (\bar{d} \times L) + (Z \times \sigma_d \times \sqrt{L})$$
  Donde $Z = 1.645$ para un Nivel de Servicio del 95%.

---

## 4. Guía de Manejo de Git y Ramas

* **Rama `main`:** Rama protegida de producción y código estable.
* **Rama `isai`:** Rama de trabajo principal activa de desarrollo y mejoras continuas.
* **Convención de Commits:** Conventional Commits (`feat:`, `fix:`, `security:`, `docs:`, `refactor:`, `test:`).
* **Secretos:** NUNCA hacer commit de archivos `.env`, contraseñas en texto plano ni tokens de autenticación. Utilizar variables de entorno parametrizadas.

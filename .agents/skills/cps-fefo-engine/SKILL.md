---
name: cps-fefo-engine
description: >-
  Audita, prueba y desarrolla la lógica de rotación estricta FEFO (First-Expired, First-Out)
  para insumos sanitarios y FIFO para insumos administrativos en el Almacén CPS.
  Úsalo cuando modifiques módulos de despacho, validación de caducidades o emisión de alertas 403 Forbidden.
---

# Habilidad: Motor de Rotación FEFO / FIFO — Almacén CPS

Esta habilidad define los procedimientos, reglas de negocio y flujos de prueba para el motor de despacho por lotes atómicos de la Caja Petrolera de Salud (CPS Cochabamba).

---

## 1. Reglas de Negocio Sanitarias

| Tipo de Insumo | Criterio de Rotación | Comportamiento en Despacho | Código HTTP ante Violación |
| :--- | :--- | :--- | :--- |
| **Sanitario / Farmacéutico** | **FEFO** (First Expired, First Out) | Se despacha el lote con `fecha_vencimiento` más próxima y `stock_actual > 0`. | `403 Forbidden` |
| **Administrativo / Oficina** | **FIFO** (First In, First Out) | Se despacha el lote con fecha cronológica de recepción (`created_at`) más antigua. | Advertencia / sugerencia automática |

---

## 2. Flujo de Validación del Despacho (Paso a Paso)

Al recibir una solicitud de despacho (`POST /api/v1/dispatch/confirm`):

1. **Identificación de Insumo y Lote:**
   * Recuperar el lote seleccionado por el operario: `loteSeleccionado = await Lote.findByPk(id_lote, { include: [Insumo] })`.
2. **Evaluación de Tipo:**
   * Si `loteSeleccionado.Insumo.tipo === 'sanitario'`:
     * Buscar en la base de datos si existe algún lote activo prioritario:
       ```javascript
       const lotePrioritario = await Lote.findOne({
         where: {
           id_insumo: loteSeleccionado.id_insumo,
           activo: true,
           stock_actual: { [Op.gt]: 0 },
           fecha_vencimiento: { [Op.lt]: loteSeleccionado.fecha_vencimiento }
         },
         order: [['fecha_vencimiento', 'ASC']]
       });
       ```
     * Si `lotePrioritario` existe:
       * **ABORTAR TRANSACCIÓN**: Retornar inmediatamente respuesta `403`:
         ```json
         {
           "success": false,
           "message": "BLOQUEO SANITARIO FEFO: Existe un lote con fecha de caducidad más próxima que debe despacharse primero.",
           "error": "VIOLACION_REGLA_FEFO",
           "lote_rechazado": {
             "id_lote": 15,
             "numero_lote": "LOTE-2026-B",
             "fecha_vencimiento": "2027-01-15"
           },
           "lote_obligatorio": {
             "id_lote": 12,
             "numero_lote": "LOTE-2025-A",
             "fecha_vencimiento": "2026-12-01",
             "ubicacion_pasillo": "Pasillo 3 - Estante B",
             "stock_disponible": 45
           }
         }
         ```
3. **Ejecución Transaccional ACID:**
   * Si la validación es aprobada, dentro de `sequelize.transaction(async (t) => { ... })`:
     * Descontar stock del lote: `lote.stock_actual -= cantidad; await lote.save({ transaction: t })`.
     * Registrar asiento contable en `MovimientoKardex` con `tipo_movimiento = 'EGRESO'`.
     * Actualizar estado en `SolicitudDespacho` a `'COMPLETADO'`.
     * Registrar auditoría en `BitacoraAuditoria`.

---

## 3. Semáforo de Vencimiento de Lotes

El sistema cataloga los lotes en tres niveles de criticidad:
* 🔴 **Rojo (Crítico):** `fecha_vencimiento <= NOW() + 30 días` $\rightarrow$ Bloqueo o despacho urgente prioritario.
* 🟡 **Amarillo (Alerta temprana):** `fecha_vencimiento <= NOW() + 60 días` $\rightarrow$ Sugerencia de rotación a salas médicas.
* 🟢 **Verde (Óptimo):** `fecha_vencimiento > NOW() + 60 días` $\rightarrow$ Almacenamiento seguro.

---

## 4. Comprobación y Testing de la Regla

Para verificar que el motor FEFO está funcionando sin alterar la base de datos real:
1. Inspeccionar el controlador: `backend/src/modules/dispatch/dispatch.service.js`.
2. Verificar que el frontend móvil responda adecuadamente con el componente `frontend_mobile/src/components/FefoAlertModal.js`.

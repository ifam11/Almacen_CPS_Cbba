---
name: cps-database-kardex
description: >-
  Administra el esquema relacional MySQL, las semillas de prueba, los modelos Sequelize
  y garantiza la inmutabilidad de la bitácora forense y el libro mayor contable (Kardex)
  del Almacén CPS Cochabamba. Úsalo al modificar migraciones, esquemas o consultas transaccionales.
---

# Habilidad: Base de Datos Relacional y Kardex Inmutable — Almacén CPS

Esta habilidad provee la referencia técnica del esquema de base de datos MySQL 8+, los modelos Sequelize, las directrices de integridad referencial y las garantías de auditoría estricta para la Caja Petrolera de Salud (CPS).

---

## 1. Topología del Esquema Relacional

```
[roles] 1 ──── ∞ [usuarios]
                    │
                    ├── 1 ──── ∞ [bitacora_auditoria] (Inmutable)
                    ├── 1 ──── ∞ [solicitudes_despacho] 1 ──── ∞ [detalles_solicitud]
                    └── 1 ──── ∞ [movimientos_kardex] (Inmutable)

[proveedores] 1 ──── ∞ [lotes]
                         │
[insumos]     1 ──── ∞ ──┴── 1 ──── ∞ [movimientos_kardex]
```

---

## 2. Modelos y Tablas Fundamentales

| Tabla | Propósito Principal | Características Especiales |
| :--- | :--- | :--- |
| `usuarios` | Gestión de cuentas y credenciales RBAC | Contraseñas con hash Bcrypt (factor 10), nunca se retornan en JSON |
| `roles` | Perfiles de acceso institucional | `ADMINISTRADOR`, `GERENTE`, `ENCARGADO`, `OPERARIO`, `SOLICITANTE` |
| `insumos` | Catálogo de materiales hospitalarios | Clasificación estricta: `'sanitario'` vs `'administrativo'` |
| `lotes` | Existencias físicas por vencimiento | `fecha_vencimiento`, `codigo_qr`, `stock_actual`, `costo_unitario` |
| `movimientos_kardex` | Libro mayor contable valorizado | **Append-Only:** Prohibido `UPDATE`/`DELETE`. Métodos PEPS/UEPS/PMP |
| `bitacora_auditoria` | Registro forense de seguridad | **Append-Only:** IP, usuario, tabla, acción (`INSERT`, `UPDATE`, `DELETE`) |
| `solicitudes_despacho` | Requerimientos de salas y pisos | Ciclo de vida: `PENDIENTE` $\rightarrow$ `EN_REVISION` $\rightarrow$ `DESPACHADO` / `RECHAZADO` |
| `sucursales` | Centros médicos dependientes de CPS | Cochabamba Central, Policlínicas, etc. |

---

## 3. Garantías de Inmutabilidad en Sequelize

En los modelos `backend/src/models/MovimientoKardex.js` y `backend/src/models/BitacoraAuditoria.js`, se deben implementar hooks defensivos:

```javascript
// Hook defensivo contra modificaciones accidentales
MovimientoKardex.beforeUpdate(() => {
  throw new Error('VIOLACION_SEGURIDAD: Los registros del Kardex son inmutables y no admiten modificaciones (Append-Only).');
});

MovimientoKardex.beforeDestroy(() => {
  throw new Error('VIOLACION_SEGURIDAD: Los registros del Kardex son inmutables y no admiten eliminación física.');
});
```

---

## 4. Comandos de Mantenimiento y Semillas

### Ejecución de Scripts SQL Directos:
```sql
-- Cargar esquema relacional
mysql -u root -p almacen_cps < database/schema.sql

-- Cargar datos de prueba
mysql -u root -p almacen_cps < database/seeds.sql
```

### Ejecución mediante el Seeder Node.js:
```bash
cd backend
npm run db:seed
```
Este script inicializa los roles, usuarios por defecto (`Admin123*`), catálogo de insumos médicos de Cochabamba y proveedores autorizados.

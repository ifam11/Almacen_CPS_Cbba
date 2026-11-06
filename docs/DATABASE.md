# Diccionario y Arquitectura de Base de Datos — Almacén CPS

* **Motor:** MySQL 8.0+
* **Motor de Almacenamiento:** InnoDB (Soporte transaccional ACID)
* **Juego de Caracteres:** `utf8mb4` / Collation: `utf8mb4_unicode_ci`
* **Base de Datos:** `almacen_cps`

---

## 1. Diagrama Entidad-Relación (ERD)

```mermaid
erDiagram
    ROLES ||--o{ USUARIOS : asigna
    USUARIOS ||--o{ BITACORA_AUDITORIA : registra
    USUARIOS ||--o{ SOLICITUDES_DESPACHO : solicita
    USUARIOS ||--o{ MOVIMIENTO_KARDEX : ejecuta
    
    PROVEEDORES ||--o{ LOTES : suministra
    INSUMOS ||--o{ LOTES : categoriza
    INSUMOS ||--o{ DETALLE_SOLICITUD : contiene
    INSUMOS ||--o{ MOVIMIENTO_KARDEX : asienta
    
    SOLICITUDES_DESPACHO ||--o{ DETALLE_SOLICITUD : detalla
    SOLICITUDES_DESPACHO ||--o{ MOVIMIENTO_KARDEX : genera
    
    LOTES ||--o{ MOVIMIENTO_KARDEX : afecta

    ROLES {
        int id_rol PK
        string nombre
        string descripcion
    }

    USUARIOS {
        int id_usuario PK
        int id_rol FK
        string nombre_completo
        string email UK
        string password_hash
        boolean activo
    }

    PROVEEDORES {
        int id_proveedor PK
        string nit_rut UK
        string razon_social
        string contacto_nombre
        string telefono
        string email
    }

    INSUMOS {
        int id_insumo PK
        string codigo_institucional UK
        string nombre
        enum tipo "SANITARIO, ADMINISTRATIVO"
        string unidad_medida
        int stock_minimo
        int punto_reorden
    }

    LOTES {
        int id_lote PK
        int id_insumo FK
        int id_proveedor FK
        string numero_lote
        string codigo_qr UK
        int cantidad_inicial
        int cantidad_actual
        decimal costo_unitario
        date fecha_vencimiento
        enum estado "DISPONIBLE, AGOTADO, VENCIDO, CUARENTENA"
        string ubicacion_pasillo
    }

    SOLICITUDES_DESPACHO {
        int id_solicitud PK
        string codigo_solicitud UK
        int id_usuario_solicitante FK
        string departamento_destino
        enum estado "PENDIENTE, EN_PROCESO, COMPLETADO, RECHAZADO"
        datetime fecha_solicitud
    }

    DETALLE_SOLICITUD {
        int id_detalle PK
        int id_solicitud FK
        int id_insumo FK
        int cantidad_solicitada
        int cantidad_despachada
    }

    MOVIMIENTO_KARDEX {
        bigint id_movimiento PK
        int id_insumo FK
        int id_lote FK
        int id_usuario FK
        int id_solicitud FK
        enum tipo_movimiento "INGRESO, DESPACHO, AJUSTE, BAJA_VENCIMIENTO"
        int cantidad
        int saldo_lote_resultante
        decimal costo_unitario
        decimal costo_total
        datetime fecha_movimiento
    }

    BITACORA_AUDITORIA {
        bigint id_auditoria PK
        int id_usuario FK
        string accion
        string tabla_afectada
        string registro_id
        json valores_anteriores
        json valores_nuevos
        string ip
        string user_agent
        datetime fecha_hora
    }
```

---

## 2. Estrategia de Indexación de Alto Rendimiento

Para asegurar que las consultas de validación en pasillo y entrenamiento de modelos respondan en milisegundos:

1. **Escaneo QR en Pasillo (`idx_lotes_qr`):**
   * Índice único en `lotes.codigo_qr`. Búsqueda $O(1)$ cuando la cámara del dispositivo móvil captura la etiqueta térmica.
2. **Consulta FEFO en Tiempo Real (`idx_lotes_fefo`):**
   * Índice compuesto: `(id_insumo, estado, fecha_vencimiento, cantidad_actual)`.
   * Permite evaluar instantáneamente si existe un lote más antiguo sin hacer full-table scan.
3. **Consulta FIFO en Tiempo Real (`idx_lotes_fifo`):**
   * Índice compuesto: `(id_insumo, estado, fecha_ingreso, cantidad_actual)`.
4. **Alimentación del Modelo de Machine Learning (`idx_kardex_ml`):**
   * Índice compuesto: `(id_insumo, fecha_movimiento, tipo_movimiento)`.
   * Agrupa los consumos históricos por serie temporal eficientemente.

---

## 3. Garantías de Integridad y Restricciones de Check

* `chk_lote_cantidad_positiva`: Asegura que `cantidad_actual >= 0` a nivel de base de datos, impidiendo inventarios negativos.
* `chk_lote_costo_positivo`: Garantiza costos unitarios no negativos.
* `chk_detalle_cantidades`: Valida que `cantidad_solicitada > 0` y `cantidad_despachada >= 0`.
* Llaves foráneas con `ON DELETE RESTRICT` en catálogos base (insumos, proveedores, roles y usuarios) para prevenir eliminaciones en cascada accidentales.

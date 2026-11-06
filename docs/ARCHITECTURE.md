# Arquitectura del Sistema — Almacén Central CPS Cochabamba

Este documento describe la arquitectura técnica, los patrones de diseño, el flujo de datos y las garantías de seguridad del **Ecosistema de Gestión, Trazabilidad e Inteligencia de Inventarios** de la Caja Petrolera de Salud (CPS).

---

## 1. Visión General de la Arquitectura

El sistema está diseñado bajo una arquitectura modular desacoplada basada en microservicios y Clean Architecture:

```mermaid
graph TD
    subgraph Clientes ["Capa de Presentación / Clientes"]
        Web["Frontend Web (React 18 + Vite)\nPuerto: 5173\nPortal Gerencial & Reportes"]
        Mobile["Frontend Móvil (React Native + Expo)\nPuerto: 8081\nOperarios de Pasillo & Escáner QR"]
        Grafana["Grafana OSS v10\nPuerto: 3001\nTelemetría & MLOps Dashboards"]
    end

    subgraph API ["Capa de Servicios y Negocio"]
        Backend["Backend RESTful API (Node.js + Express)\nPuerto: 5000\nClean Architecture & RBAC"]
        AIService["Servicio de Inteligencia Artificial (Python)\nRandom Forest Regressor\nPredicción de Demanda & ROP"]
    end

    subgraph Datos ["Capa de Persistencia"]
        MySQL[("MySQL Server 8+\nPuerto: 3306\nACID Transaccional\nKardex & Bitácora Append-Only")]
    end

    Web -->|HTTP / REST + JWT| Backend
    Mobile -->|HTTP / REST + JWT| Backend
    Backend -->|Proceso / Socket| AIService
    Backend -->|Sequelize ORM| MySQL
    Grafana -->|MySQL Proxy / Read-Only| MySQL
```

---

## 2. Diagrama de Secuencia: Despacho Hospitalario con Validación FEFO

La regla **FEFO** (First Expired, First Out) es obligatoria para insumos clasificados como sanitarios. A continuación se ilustra el flujo cuando un operario escanea un código QR:

```mermaid
sequenceDiagram
    autonumber
    actor Operario as Operario en Pasillo
    participant Mobile as App Móvil (Expo)
    participant API as Backend REST API
    participant DB as MySQL (Transacción ACID)

    Operario->>Mobile: Escanea código QR del lote físico
    Mobile->>API: POST /api/v1/dispatch/confirm { id_solicitud, id_lote, cantidad }
    Note over API: Inicia sequelize.transaction()
    API->>DB: Consultar loteSeleccionado e Insumo
    DB-->>API: Datos del lote (tipo, fecha_vencimiento, stock)

    alt Insumo es Sanitario
        API->>DB: SELECT * FROM lotes WHERE id_insumo = :id AND fecha_vencimiento < :fecha_sel AND stock_actual > 0
        alt Existe Lote con Vencimiento Anterior
            DB-->>API: Retorna lotePrioritario
            Note over API: VIOLACION DE REGLA FEFO
            API-->>Mobile: HTTP 403 Forbidden { error: 'VIOLACION_REGLA_FEFO', lote_obligatorio }
            Mobile->>Operario: Despliega FefoAlertModal (Alerta Roja: lote que debe retirar)
        else Es el Lote Correcto (FEFO Aprobado)
            API->>DB: Descontar stock_actual en tabla lotes
            API->>DB: INSERT INTO movimientos_kardex (EGRESO, cantidad, saldo)
            API->>DB: UPDATE solicitudes_despacho SET estado = 'COMPLETADO'
            API->>DB: INSERT INTO bitacora_auditoria (IP, usuario, acción)
            Note over API,DB: COMMIT de Transacción
            API-->>Mobile: HTTP 200 OK { success: true, comprobante_kardex }
            Mobile->>Operario: Despliega DispatchSuccessModal con No. de Kardex
        end
    else Insumo es Administrativo (FIFO)
        Note over API: Aplica orden cronológico por created_at
        API->>DB: Ejecutar egreso transaccional
        API-->>Mobile: HTTP 200 OK { success: true }
    end
```

---

## 3. Capas de la Clean Architecture en el Backend

1. **Entities / Models (`src/models/`):**
   * Definición declarativa en Sequelize de tablas relacionales con validación de tipos, restricciones `NOT NULL`, llaves foráneas e índices.
   * Hooks defensivos para prevenir `UPDATE` o `DELETE` sobre `MovimientoKardex` y `BitacoraAuditoria`.
2. **Services (`src/modules/*/service.js`):**
   * Contienen toda la lógica de negocio pura: cálculo de saldos ponderados, verificación FEFO/FIFO, transacciones multi-tabla y llamadas al motor predictivo.
3. **Controllers (`src/modules/*/controller.js`):**
   * Recepción y validación de peticiones HTTP, extracción de parámetros (`req.body`, `req.params`) y serialización de respuestas mediante `responseHandler.js`.
4. **Middlewares (`src/middlewares/`):**
   * `authMiddleware.js`: Verificación de tokens JWT y extracción de usuario activo.
   * `roleMiddleware.js`: Control de acceso basado en roles (RBAC).
   * `auditMiddleware.js`: Interceptor automático para bitácora forense con IP y User-Agent.
   * `errorHandler.js`: Manejo global de excepciones para evitar filtración de trazas internas.

---

## 4. Inmutabilidad y Auditoría Forense

Cualquier cambio de estado en la base de datos deja un rastro inmutable:

* **Kardex Contable:** Los movimientos (`INGRESO`, `EGRESO`, `AJUSTE_POSITIVO`, `AJUSTE_NEGATIVO`) recalculan el saldo acumulado en cada fila. No existe actualización de saldos antiguos.
* **Bitácora de Auditoría:** Almacena el ID del usuario, la acción realizada, la dirección IP de origen, la fecha/hora en zona horaria boliviana (`-04:00`), y los objetos JSON con los valores anteriores y los valores nuevos.

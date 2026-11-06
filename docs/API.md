# Especificación de la API RESTful — Almacén CPS Cochabamba

* **Versión:** 1.0.0
* **Prefijo Base:** `/api/v1`
* **Protocolo:** HTTP/HTTPS
* **Formato de Datos:** `application/json`
* **Autenticación:** Cabecera `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Estándar de Respuesta (Envelope)

### Respuesta Exitosa:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación ejecutada correctamente."
}
```

### Respuesta de Error:
```json
{
  "success": false,
  "message": "Mensaje legible del error",
  "error": "CODIGO_IDENTIFICADOR_ERROR"
}
```

---

## 2. Catálogo de Endpoints

### Módulo 1: Autenticación & Perfil (`/auth`)

| Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Público | Autenticación institucional con email y contraseña |
| `GET` | `/api/v1/auth/me` | Autenticado | Obtener datos del usuario en sesión actual |
| `POST` | `/api/v1/auth/refresh` | Autenticado | Renovación del token JWT |

#### Ejemplo de Login:
`POST /api/v1/auth/login`
```json
// Request:
{
  "email": "operario@cps.gob.bo",
  "password": "Admin123*"
}

// Response (200 OK):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": 4,
      "nombre_completo": "Carlos Mendoza P.",
      "email": "operario@cps.gob.bo",
      "rol": "OPERARIO"
    }
  },
  "message": "Acceso concedido."
}
```

---

### Módulo 2: Catálogo de Insumos & Recepción (`/items`, `/reception`)

| Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/items` | Todos | Listar catálogo de insumos médicos y administrativos |
| `POST` | `/api/v1/items` | `ADMINISTRADOR`, `ENCARGADO` | Registrar nuevo insumo con clasificación sanitaria |
| `GET` | `/api/v1/items/:id/lotes` | Todos | Listar lotes activos con existencias y vencimientos |
| `POST` | `/api/v1/reception` | `ADMINISTRADOR`, `ENCARGADO` | Registrar ingreso por lotes y emitir código QR Base64 |

#### Ejemplo de Recepción de Lote:
`POST /api/v1/reception`
```json
// Request:
{
  "id_insumo": 1,
  "id_proveedor": 2,
  "numero_lote": "LOT-2026-FARM-01",
  "fecha_vencimiento": "2027-08-30",
  "cantidad": 500,
  "costo_unitario": 12.50,
  "ubicacion_pasillo": "Pasillo 2 - Estante A"
}

// Response (201 Created):
{
  "success": true,
  "data": {
    "id_lote": 45,
    "numero_lote": "LOT-2026-FARM-01",
    "codigo_qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "id_kardex": 182
  },
  "message": "Lote recibido y asentado en Kardex."
}
```

---

### Módulo 3: Motor de Despacho & Validación FEFO (`/dispatch`)

| Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dispatch/requests` | Todos | Listar pedidos de servicios médicos y quirófanos |
| `POST` | `/api/v1/dispatch/confirm` | `ADMINISTRADOR`, `ENCARGADO`, `OPERARIO` | Confirmar egreso físico con validación FEFO/FIFO |

#### Respuesta de Error: Bloqueo Sanitario FEFO (403 Forbidden)
```json
{
  "success": false,
  "message": "BLOQUEO SANITARIO FEFO: Existe un lote con fecha de caducidad más próxima que debe despacharse primero.",
  "error": "VIOLACION_REGLA_FEFO",
  "lote_rechazado": {
    "id_lote": 52,
    "numero_lote": "LOTE-2026-NOV",
    "fecha_vencimiento": "2027-11-01"
  },
  "lote_obligatorio": {
    "id_lote": 31,
    "numero_lote": "LOTE-2026-ENE",
    "fecha_vencimiento": "2026-12-15",
    "ubicacion_pasillo": "Pasillo 1 - Bandeja 3",
    "stock_disponible": 60
  }
}
```

---

### Módulo 4: Dashboard Gerencial & Alertas (`/dashboard`)

| Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/metrics` | `ADMINISTRADOR`, `GERENTE` | Resumen de valorización total, rotación y stock crítico |
| `GET` | `/api/v1/dashboard/expirations` | Todos | Semáforo de vencimientos (<30 días rojo, <60 días amarillo) |
| `GET` | `/api/v1/dashboard/financial` | `ADMINISTRADOR`, `GERENTE` | Desglose monetario Sanitario vs Administrativo |

---

### Módulo 5: Inteligencia Artificial Predictiva (`/ai`)

| Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/ai/predict/:id_insumo` | Todos | Pronóstico de demanda a 30/60/90 días (Random Forest) |
| `GET` | `/api/v1/ai/reorder-points` | `ADMINISTRADOR`, `GERENTE` | Lista de insumos que han alcanzado o cruzado el Punto de Reorden (ROP) |

---

### Módulo 6: Auditoría Forense (`/audit`)

| Método | Endpoint | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/audit/logs` | `ADMINISTRADOR` | Consulta de la bitácora inmutable con filtros por IP, fecha y usuario |

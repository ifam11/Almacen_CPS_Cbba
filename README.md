# Ecosistema Web y Móvil de Gestión, Trazabilidad e Inteligencia de Inventarios
### Almacén Central — Caja Petrolera de Salud (CPS)

Este repositorio contiene la solución completa de grado de producción para el control integral de inventarios hospitalarios, basada en **Clean Architecture**, **SOLID**, **lógica por lotes atómicos**, **trazabilidad inmutable en Kardex y Bitácora** y cumplimiento estricto de las reglas de rotación **FEFO** (fármacos sanitarios) y **FIFO** (material administrativo).

---

## Estructura del Ecosistema

```
Almacen_CPS/
├── database/                    # Scripts DDL y semillas MySQL transaccional ACID
│   ├── schema.sql               # Esquema relacional con FK, tipos exactos e índices FEFO/FIFO
│   └── seeds.sql                # Roles RBAC, usuarios con hash Bcrypt, proveedores e insumos
│
├── backend/                     # API RESTful en Node.js + Express.js (Clean Architecture)
│   ├── src/
│   │   ├── config/              # Conexión Sequelize (Pool, zona horaria -04:00) y JWT
│   │   ├── middlewares/         # JWT, RBAC, Auditoría Inmutable (IP, tabla, acción) y Errores
│   │   ├── models/              # Modelos Sequelize con hooks de inmutabilidad (Kardex y Bitácora)
│   │   ├── modules/
│   │   │   ├── auth/            # Módulo 1: Login institucional con Bcrypt y JWT
│   │   │   ├── users/           # Módulo 1: CRUD de usuarios y roles RBAC
│   │   │   ├── audit/           # Módulo 1: Consulta forense de la bitácora inmutable
│   │   │   ├── suppliers/       # Módulo 2: Proveedores con validación de NIT/RUT único
│   │   │   ├── items/           # Módulo 2: Catálogo de Insumos (Sanitarios vs Administrativos)
│   │   │   ├── reception/       # Módulo 2: Recepción por lotes ACID y emisión de QR (Base64)
│   │   │   ├── dispatch/        # Módulo 3: Motor de Despacho con validación FEFO (HTTP 403)
│   │   │   ├── dashboard/       # Módulo 4: Métricas financieras y semáforo (<30d y <60d)
│   │   │   └── ai/              # Módulo 5: Orquestador Node.js -> Python predictivo
│   │   ├── utils/               # Formato de respuesta { success, data, message }
│   │   ├── app.js               # Middlewares globales y enrutador modular
│   │   ├── server.js            # Punto de arranque y graceful shutdown
│   │   └── scripts/seed.js      # Seeder ejecutable con Node.js
│   └── package.json
│
├── frontend_web/                # Portal Administrativo / Gerencial en React.js (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              # Navbar con reloj oficial de La Paz y perfil
│   │   │   ├── MetricCard.jsx          # Tarjetas de valorización, rotación y alertas
│   │   │   ├── ExpiryAlertTable.jsx    # Semáforo de caducidad (<30d Roja, <60d Amarilla)
│   │   │   ├── FinancialBreakdown.jsx  # Gráfico comparativo Sanitario vs Administrativo
│   │   │   ├── ReorderAlertList.jsx    # Alertas de punto de reorden y quiebre de stock
│   │   │   ├── RecentKardexFeed.jsx    # Feed contable en vivo del Kardex
│   │   │   ├── QrDetailModal.jsx       # Visualización e impresión de etiquetas térmicas QR
│   │   │   ├── AIPredictionModal.jsx   # Pronóstico Random Forest y ajuste de ROP
│   │   │   └── LoginModal.jsx          # Modal de acceso gerencial
│   │   ├── context/AuthContext.jsx     # Gestión de sesión JWT
│   │   ├── services/api.js             # Cliente Axios con interceptor
│   │   ├── index.css                   # Sistema de diseño empresarial
│   │   └── App.jsx                     # Dashboard integral
│   └── package.json
│
├── frontend_mobile/             # App Móvil para Operarios en Pasillo (React Native / Expo)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js          # Acceso institucional de operarios
│   │   │   ├── HomeScreen.js           # Botón Gigante de Escaneo de QR en pasillo
│   │   │   ├── ScannerScreen.js        # Visor de cámara nativa con retícula y linterna
│   │   │   └── LoteDetailScreen.js     # Detalle del lote, selector y confirmación
│   │   ├── components/
│   │   │   ├── FefoAlertModal.js       # Modal de Bloqueo Sanitario (HTTP 403 Forbidden)
│   │   │   └── DispatchSuccessModal.js # Comprobante de egreso con número de Kardex
│   │   ├── config/api.js               # Conexión móvil con la API REST
│   │   └── context/AuthContext.js      # Sesión de operario
│   ├── App.js                          # Enrutador móvil
│   ├── app.json                        # Permisos de cámara en Android/iOS
│   └── package.json
│
└── ai_service/                  # Microservicio de Inteligencia Artificial (Python 3)
    ├── predict_demand.py        # Random Forest Regressor, Lags, cálculo ROP y SS
    ├── requirements.txt         # Scikit-learn, Pandas, Numpy, Scipy
    └── .venv/                   # Entorno virtual con paquetes instalados
```

---

## Puesta en Marcha Rápida

### 1. Base de Datos MySQL
1. En tu servidor MySQL (local, Docker o XAMPP), ejecuta el script:
   ```sql
   source database/schema.sql;
   source database/seeds.sql;
   ```
2. O ejecuta el seeder automatizado en Node.js:
   ```bash
   cd backend
   npm run db:seed
   ```

### 2. Backend (API RESTful)
```bash
cd backend
npm start
# O en modo desarrollo con recarga automática:
npm run dev
```
* Servidor activo en: `http://localhost:5000`
* Verificación de salud: `http://localhost:5000/api/v1/health`

### 3. Frontend Web (Dashboard Gerencial)
```bash
cd frontend_web
npm run dev
```
* Dashboard visible en: `http://localhost:5173`

### 4. Frontend Móvil (Operarios en Pasillo)
```bash
cd frontend_mobile
npm start
```
* Abre la app en el emulador de Android/iOS o escanea el código QR con **Expo Go** en tu dispositivo físico.

---

## Credenciales Institucionales Pre-configuradas (Bcrypt Costo 10)

| Rol | Correo Institucional | Contraseña | Perfil y Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@cps.gob.bo` | `Admin123*` | Control total, configuración de usuarios, auditoría y catálogo |
| **Gerente** | `gerencia@cps.gob.bo` | `Admin123*` | Dashboard analítico, valorización monetaria, rotación y semáforos |
| **Encargado** | `encargado@cps.gob.bo` | `Admin123*` | Recepción de mercancía, emisión de QR, insumos y proveedores |
| **Operario** | `operario@cps.gob.bo` | `Admin123*` | App móvil: Escaneo de QR, confirmación en pasillo y validación FEFO |
| **Solicitante** | `solicitante@cps.gob.bo` | `Admin123*` | Médicos/Enfermería que solicitan despachos de salas y quirófanos |

---

## Comportamiento del Motor de Reglas Críticas

### 1. Validación FEFO Estricta (Insumos Sanitarios / Fármacos)
* Si un operario escanea un lote cuya fecha de caducidad es posterior a la de otro lote activo con existencias disponibles, la API intercepta la solicitud y responde:
  * **Código de Estado HTTP:** `403 Forbidden`
  * **Payload:** Detalla el lote rechazado y el lote obligatorio que debe retirarse con su ubicación física en pasillo.
  * **App Móvil:** Despliega el modal de emergencia médica en rojo advirtiendo el bloqueo y guiando al operario al pasillo del lote prioritario.

### 2. Regla FIFO (Insumos Administrativos)
* Prioriza el despacho de los lotes por orden cronológico de ingreso a almacén.

### 3. Inmutabilidad de Auditoría y Kardex
* Los modelos `BitacoraAuditoria` y `MovimientoKardex` implementan hooks a nivel de ORM que rechazan cualquier sentencia `UPDATE` o `DELETE` físico (*Append-Only*). Las modificaciones de datos (POST, PUT, DELETE) se registran automáticamente en la bitácora con IP, usuario, tabla y valores anteriores/nuevos.

### 4. Inteligencia Artificial (Random Forest Regressor)
* El script `ai_service/predict_demand.py` procesa los históricos de despacho, genera características temporales rezagadas (*Lags 1..7* y medias móviles), proyecta la demanda mensual del ciclo entrante y calcula el Punto de Reorden ($ROP$) y Stock de Seguridad ($SS$) bajo la fórmula estocástica:
  $$ROP = (\bar{d} \times L) + (Z \times \sigma_d \times \sqrt{L})$$

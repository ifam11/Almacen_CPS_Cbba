---
name: cps-ecosystem-dev
description: >-
  Arranca, valida, diagnostica y prueba el ecosistema completo de 5 servicios de Almacén CPS
  (MySQL 3306, Backend Node.js 5000, Frontend Web Vite 5173, Frontend Mobile Expo 8081 y Grafana 3001).
  Úsalo cuando necesites iniciar servicios, verificar puertos o solucionar problemas de conectividad local.
---

# Habilidad: Desarrollo y Operación del Ecosistema — Almacén CPS

Esta habilidad provee los comandos, puertos, variables y diagnósticos para operar los 5 microservicios del proyecto Almacén CPS en un entorno local o de pruebas.

---

## 1. Mapeo de Servicios y Puertos

| Servicio | Puerto | Tecnología | Comando de Inicio | URL de Comprobación |
| :--- | :--- | :--- | :--- | :--- |
| **MySQL Database** | `3306` | MySQL Server 8+ | `iniciar_mysql_admin.bat` | `tcp://127.0.0.1:3306` |
| **Backend REST API** | `5000` | Node.js / Express | `cd backend && npm run dev` | `http://localhost:5000/api/v1/health` |
| **Frontend Web** | `5173` | React 18 / Vite | `cd frontend_web && npm run dev` | `http://localhost:5173` |
| **Frontend Mobile** | `8081` | React Native / Expo | `cd frontend_mobile && npx expo start` | `http://localhost:8081` |
| **Grafana OSS** | `3001` | Grafana v10 | `cd grafana_service && run_grafana.bat` | `http://localhost:3001` |

---

## 2. Lanzamiento Automatizado (Un Solo Clic)

El proyecto incluye el lanzador integral:
```cmd
.\iniciar_todo.bat
```
Este script de Windows se encarga de:
1. Verificar si el puerto 3306 de MySQL está respondiendo o levantarlo automáticamente.
2. Iniciar el Backend API en una ventana independiente.
3. Iniciar el Frontend Web Vite en una ventana independiente.
4. Iniciar el Metro Bundler de Expo para la app móvil en una ventana independiente.
5. Iniciar Grafana OSS en el puerto 3001 con datasources y dashboards provisionados.

---

## 3. Diagnóstico de Puertos y Solución de Problemas

### Comprobar si los puertos están ocupados:
```powershell
Get-NetTCPConnection -LocalPort 3306, 5000, 5173, 8081, 3001 -ErrorAction SilentlyContinue | Select-Object LocalPort, State, OwningProcess
```

### Liberar un puerto bloqueado:
```powershell
Stop-Process -Id <PID> -Force
```

---

## 4. Estructura de Entorno Local

* **Backend (`backend/.env`):**
  * `PORT=5000`
  * `DB_HOST=127.0.0.1`
  * `DB_PORT=3306`
  * `DB_NAME=almacen_cps`
  * `JWT_SECRET=...`
* **Grafana (`grafana_service/conf/grafana.ini`):**
  * `http_port = 3001`
  * Provisioning automático de fuentes de datos (`conf/provisioning/datasources/datasources.yaml`) y paneles JSON (`conf/provisioning/dashboards/json/`).

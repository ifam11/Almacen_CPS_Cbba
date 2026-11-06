@echo off
title Lanzador General - Ecosistema Almacen Central CPS
echo =========================================================================
echo   SISTEMA DE GESTION Y TRAZABILIDAD DE INVENTARIOS - CPS
echo =========================================================================

echo 1. Verificando/Iniciando Servicio MySQL...
call "%~dp0iniciar_mysql_admin.bat"

echo 2. Iniciando Backend REST API (Puerto 5000)...
start "Backend CPS API (Puerto 5000)" cmd /c "cd /d %~dp0backend && npm run dev"

echo 3. Iniciando Frontend Web Dashboard (Puerto 5173)...
start "Frontend Web CPS (Puerto 5173)" cmd /c "cd /d %~dp0frontend_web && npm run dev"

echo 4. Iniciando Frontend Mobile Expo (Puerto 8081)...
start "Frontend Mobile Expo CPS (Puerto 8081)" cmd /c "cd /d %~dp0frontend_mobile && npx expo start"

echo 5. Iniciando Grafana OSS (Puerto 3001)...
start "Grafana Service CPS (Puerto 3001)" cmd /c "cd /d %~dp0grafana_service && run_grafana.bat"

echo =========================================================================
echo Todos los servicios han sido lanzados en ventanas independientes.
echo Acceso Web: http://localhost:5173
echo API Health: http://localhost:5000/api/v1/health
echo Grafana:   http://localhost:3001
echo Expo Metro: http://localhost:8081
echo =========================================================================
pause

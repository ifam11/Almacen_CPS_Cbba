@echo off
title Grafana OSS - Caja Petrolera de Salud (CPS)
echo =========================================================================
echo Iniciando Servicio de Grafana v10 (CPS Almacen Central ^& IA MLOps)
echo Puerto: http://localhost:3001
echo Base de Datos: MySQL 8 (almacen_cps)
echo =========================================================================
cd /d "%~dp0grafana-v10.4.2"
.\bin\grafana-server.exe
pause

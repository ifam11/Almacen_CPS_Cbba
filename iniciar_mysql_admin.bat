@echo off
:: Script para asegurar la ejecucion de MySQL (MySQL267 o daemon local)
echo =========================================================================
echo Verificando puerto MySQL 3306...
echo =========================================================================

powershell -Command "if ((Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue).TcpTestSucceeded) { exit 0 } else { exit 1 }"
if %errorLevel% EQU 0 (
    echo [OK] MySQL ya esta activo y escuchando en el puerto 3306.
    goto :fin
)

echo Intentando iniciar servicio MySQL de Windows...
net session >nul 2>&1
if %errorLevel% EQU 0 (
    net start MySQL267 >nul 2>&1
)

powershell -Command "if ((Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue).TcpTestSucceeded) { exit 0 } else { exit 1 }"
if %errorLevel% EQU 0 (
    echo [OK] Servicio de Windows MySQL267 iniciado con exito.
    goto :fin
)

echo Iniciando motor MySQL integrado en puerto 3306...
if exist "C:\Program Files\MySQL\MySQL Server 26.7\bin\mysqld.exe" (
    start "MySQL Daemon 3306" /B "C:\Program Files\MySQL\MySQL Server 26.7\bin\mysqld.exe" --datadir="%~dp0database\mysql_datadir" --port=3306 --console
    timeout /t 3 /nobreak >nul
    echo [OK] MySQL Daemon local activo en puerto 3306.
) else (
    echo [ERROR] No se encontro el binario de MySQL.
)

:fin

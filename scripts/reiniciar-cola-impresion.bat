@echo off
setlocal
chcp 65001 >nul
title Reiniciar cola de impresion

REM --- Solicitar permisos de administrador si hacen falta ---
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Solicitando permisos de administrador...
    powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

echo [1/3] Deteniendo el servicio Cola de impresion (Spooler)...
net stop spooler /y
REM Asegura que el proceso no quede colgado
taskkill /f /im spoolsv.exe >nul 2>&1

echo [2/3] Eliminando trabajos bloqueados...
del /f /q "%SystemRoot%\System32\spool\PRINTERS\*.*" >nul 2>&1

echo [3/3] Iniciando el servicio Cola de impresion...
net start spooler

echo.
sc query spooler | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo Listo: la cola de impresion se ha reiniciado correctamente.
) else (
    echo ERROR: el servicio Spooler no se pudo iniciar.
)
echo.
pause
endlocal

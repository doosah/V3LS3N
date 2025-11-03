@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Запуск dev сервера...
echo.
echo Откроется браузер на http://localhost:3000
echo.
echo Для остановки нажми Ctrl+C
echo.
call npm run dev
pause


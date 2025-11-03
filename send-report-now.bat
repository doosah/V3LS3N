@echo off
chcp 65001 >nul
echo ========================================
echo Отправка тестового отчета
echo ========================================
echo.
echo Открываю в браузере...
start "" "https://telegram-scheduler-production.up.railway.app/send-report"
echo.
echo Отчет будет отправлен в Telegram!
echo.
echo Можно указать смену:
echo   ?shift=day   - дневная смена
echo   ?shift=night - ночная смена
echo.
pause


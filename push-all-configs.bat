@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo Отправка конфигурации Railway
echo ========================================
echo.
git add railway.json railway.toml nixpacks.toml Procfile package.json .railwayignore
echo.
git commit -m "Add all Railway configuration files"
echo.
git push
echo.
echo ========================================
echo Готово! Railway перезапустится
echo ========================================
pause


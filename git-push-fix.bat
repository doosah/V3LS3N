@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo Обновление Railway конфигурации
echo ========================================
echo.
echo Текущая директория:
cd
echo.
echo Добавляю файлы...
git add railway.json
git add nixpacks.toml
git add package.json
echo.
echo Создаю коммит...
git commit -m "Fix Railway start command"
echo.
echo Отправляю в GitHub...
git push
echo.
echo ========================================
echo Готово! Railway перезапустится
echo ========================================
pause


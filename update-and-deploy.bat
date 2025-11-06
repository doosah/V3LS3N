@echo off
REM Скрипт для автоматического обновления даты деплоя и выполнения коммита
REM Использование: update-and-deploy.bat

echo.
echo ============================================
echo  Обновление даты деплоя и отправка изменений
echo ============================================
echo.

REM Запускаем PowerShell скрипт для обновления даты
powershell -ExecutionPolicy Bypass -File "update-deploy-date.ps1"

echo.
echo Добавляем изменения в git...
git add index.html src/js/app.js src/js/excel-export.js update-deploy-date.ps1

echo.
echo Создаем коммит...
git commit -m "Автоматическое обновление даты деплоя и улучшения экспорта"

echo.
echo Отправляем изменения в GitHub...
git push origin main

echo.
echo ============================================
echo  Готово! Изменения отправлены.
echo ============================================
pause


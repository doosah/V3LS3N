@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   ИСПРАВЛЕНИЕ GIT СОСТОЯНИЯ
echo ========================================
echo.
echo Этот скрипт исправляет проблемы с git:
echo - Отменяет незавершенные rebase/merge
echo - Синхронизирует с удаленным репозиторием
echo - Применяет ваши изменения
echo.
pause
echo.
echo Шаг 1: Отменяю текущий rebase (если есть)...
git rebase --abort 2>nul
echo.
echo Шаг 2: Сохраняю текущие изменения...
git stash
echo.
echo Шаг 3: Переключаюсь на ветку main...
git checkout main
if errorlevel 1 (
    echo Создаю ветку main...
    git checkout -b main
)
echo.
echo Шаг 4: Синхронизируюсь с удаленным репозиторием...
git fetch origin
git reset --hard origin/main
echo.
echo Шаг 5: Применяю сохраненные изменения...
git stash pop
if errorlevel 1 (
    echo ℹ️  Нет сохраненных изменений
) else (
    echo ✓ Изменения применены
)
echo.
echo Шаг 6: Добавляю все файлы...
git add .
echo.
echo Шаг 7: Создаю коммит...
git commit -m "Обновление: исправления для GitHub Pages"
if errorlevel 1 (
    echo ℹ️  Нет изменений для коммита
)
echo.
echo Шаг 8: Отправляю на GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ⚠️  Push отклонен. Пробую с force-with-lease...
    echo ВНИМАНИЕ: Используется безопасный force push
    git push origin main --force-with-lease
    if errorlevel 1 (
        echo.
        echo ❌ Ошибка отправки на GitHub
        pause
        exit /b 1
    )
)
echo.
echo ========================================
echo   ГОТОВО!
echo ========================================
echo.
echo Git состояние исправлено!
echo Теперь можно использовать DEPLOY.bat для обычного деплоя
echo.
pause


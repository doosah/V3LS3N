@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add index.js
git commit -m "Fix: Add http import for server"
git push
echo.
echo Done! Railway will auto-deploy in 1-2 minutes
pause


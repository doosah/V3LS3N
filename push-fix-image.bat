@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add .
git commit -m "Fix image sending - add error handling and better logging"
git push
echo.
echo Done! Railway will deploy in 2-3 minutes
echo.
echo Check logs after deployment:
echo   railway logs --tail 50
echo.
pause


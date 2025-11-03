@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add .
git commit -m "Add detailed logging for image generation debugging"
git push
echo.
echo Done! Check logs after 2-3 minutes:
echo   railway logs --tail 100
echo.
pause


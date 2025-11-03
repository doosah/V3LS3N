@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
echo.
echo Pushing to GitHub...
echo.
git remote set-url origin https://github.com/doosah/V3LS3N-telegram-bot.git
git branch -M main
git push -u origin main
echo.
echo Done!
echo.
pause


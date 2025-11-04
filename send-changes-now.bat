@echo off
chcp 65001 >nul
echo ========================================
echo Sending changes to GitHub
echo ========================================
echo.

cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"

echo Current directory:
cd

echo.
echo Checking git status...
git status

echo.
echo Adding all files...
git add -A

echo.
echo Committing...
git commit -m "Add detailed logging for image generation debugging"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo Wait 3-4 minutes, then check Railway logs:
echo   railway logs --tail 100
echo.
pause


@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo Deploying to Railway
echo ========================================
echo.
echo Current directory:
cd
echo.
echo Checking git status...
git status
echo.
echo Adding all files...
git add .
echo.
echo Committing changes...
git commit -m "Fix Railway configuration - add server directory support"
echo.
echo Pushing to GitHub...
git push
echo.
echo ========================================
echo Done! Railway will auto-deploy
echo ========================================
pause


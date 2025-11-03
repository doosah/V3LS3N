@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo Fixing Railway configuration
echo ========================================
echo.
echo Updating railway.json...
echo.
echo Committing changes...
git add railway.json nixpacks.toml package.json
git commit -m "Fix Railway start command - use direct node path"
echo.
echo Pushing to GitHub...
git push
echo.
echo ========================================
echo Done! Railway should auto-redeploy
echo ========================================
echo.
echo Wait 2-3 minutes and check Railway logs
pause


@echo off
setlocal

cd /d "%~dp0"
if exist "%~dp0deploy.local.ps1" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.local.ps1"
) else (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy.ps1"
)
set "DEPLOY_EXIT_CODE=%ERRORLEVEL%"

echo(
if "%DEPLOY_EXIT_CODE%"=="0" (
  echo Deploy script finished successfully.
) else (
  echo Deploy script failed with exit code %DEPLOY_EXIT_CODE%.
)

pause
exit /b %DEPLOY_EXIT_CODE%

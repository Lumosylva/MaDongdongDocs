@echo off
setlocal

cd /d "%~dp0"
if exist "%~dp0scripts/build-check.ps1" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts/build-check.ps1"
) else (
  echo "Not exist build-check.ps1"
)
set "BUILD_CHECK_EXIT_CODE=%ERRORLEVEL%"

echo(
if "%BUILD_CHECK_EXIT_CODE%"=="0" (
  echo Build check script finished successfully.
) else (
  echo Build check failed with exit code %BUILD_CHECK_EXIT_CODE%.
)

pause
exit /b %BUILD_CHECK_EXIT_CODE%

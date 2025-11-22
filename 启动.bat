@echo off
PowerShell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-new.ps1"
if %ERRORLEVEL% NEQ 0 pause

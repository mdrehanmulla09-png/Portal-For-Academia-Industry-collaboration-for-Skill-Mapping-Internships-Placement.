@echo off
title SkillBridge India - Complete System Launcher
echo ================================================================
echo   🇮🇳 Starting SkillBridge India (Unified Production Server)
echo   Problem Statement ID: 26044
echo ================================================================

set PATH=C:\Program Files\nodejs;%PATH%
set PROJECT_DIR=%~dp0

echo [1/2] Starting Unified Server (Port 5000)...
start "SkillBridge Server (Port 5000)" cmd /k "cd /d %PROJECT_DIR%server && node dist/server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Cloudflare Tunnel...
echo Look for the https://*.trycloudflare.com URL below!
echo.
"C:\Users\Md rehan\.gemini\antigravity\scratch\cloudflared.exe" tunnel --url http://localhost:5000
pause

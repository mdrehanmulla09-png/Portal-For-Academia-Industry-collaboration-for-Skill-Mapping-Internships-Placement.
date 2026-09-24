@echo off
title SkillBridge India - Startup Script
echo ================================================================
echo   🇮🇳 Starting SkillBridge India (Problem Statement ID: 26044)
echo ================================================================

set PATH=C:\Program Files\nodejs;%PATH%

echo Starting Backend Server on http://localhost:5000...
start "SkillBridge Backend" cmd /k "cd /d %~dp0server && node dist/server.js"

echo Starting Frontend Dev Server on http://localhost:5173...
start "SkillBridge Frontend" cmd /k "cd /d %~dp0client && npm.cmd run dev -- --port 5173 --host"

echo ================================================================
echo   All servers launched!
echo   Open your browser at: http://localhost:5173
echo ================================================================
pause

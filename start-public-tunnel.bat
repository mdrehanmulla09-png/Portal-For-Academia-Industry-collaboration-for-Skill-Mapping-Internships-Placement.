@echo off
title SkillBridge India - Public Live URL Tunnel
echo ================================================================
echo   🇮🇳 SkillBridge India - Launching Public Cloudflare Tunnel
echo ================================================================
echo.
echo Starting secure public tunnel for http://localhost:5173...
echo Once connected, look for the https://*.trycloudflare.com URL below!
echo.
"C:\Users\Md rehan\.gemini\antigravity\scratch\cloudflared.exe" tunnel --url http://localhost:5173
pause

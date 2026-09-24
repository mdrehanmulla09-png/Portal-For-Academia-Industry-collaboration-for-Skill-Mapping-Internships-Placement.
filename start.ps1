Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  🇮🇳 Starting SkillBridge India (Problem Statement ID: 26044)" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

$env:Path = "C:\Program Files\nodejs;" + $env:Path
$rootDir = $PSScriptRoot

Write-Host "Starting Backend on http://localhost:5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\server'; `$env:Path = 'C:\Program Files\nodejs;' + `$env:Path; node dist/server.js"

Write-Host "Starting Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\client'; `$env:Path = 'C:\Program Files\nodejs;' + `$env:Path; npm.cmd run dev -- --port 5173 --host"

Write-Host "`nAll servers started! Visit: http://localhost:5173" -ForegroundColor Cyan
Start-Process "http://localhost:5173"

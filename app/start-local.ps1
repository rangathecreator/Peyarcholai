# Start NamingGuru Tamil Web MVP Locally (OmniRoute + Next.js on Port 3020)
$ErrorActionPreference = "Continue"

Write-Host "=== 1. Checking OmniRoute AI Gateway on port 20128 ===" -ForegroundColor Cyan
$health = curl.exe -s -m 3 http://localhost:20128/health
if (-not $health) {
  Write-Host "Starting OmniRoute Gateway in background with 4GB heap..." -ForegroundColor Yellow
  $env:NODE_OPTIONS="--max-old-space-size=4096"
  Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "$HOME\AppData\Local\Programs\nodejs\node_modules\omniroute\bin\omniroute.mjs","serve","--no-open" -WindowStyle Hidden
  Start-Sleep -Seconds 4
} else {
  Write-Host "OmniRoute Gateway is online at http://localhost:20128" -ForegroundColor Green
}

Write-Host "=== 2. Starting NamingGuru Next.js Web Server on http://localhost:3020 ===" -ForegroundColor Cyan
Set-Location $PSScriptRoot
npm run dev


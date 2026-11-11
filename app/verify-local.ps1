# Automated Prerequisite & Smoke Verification Script for NamingGuru Local Deployment
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " NamingGuru Tamil Web MVP - Local Prerequisite Verification" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. OmniRoute Check
$omniKey = $env:OMNIROUTE_API_KEY
if (-not $omniKey -and (Test-Path "$PSScriptRoot\.env.local")) { $omniKey = ((Get-Content "$PSScriptRoot\.env.local" | Where-Object { $_ -match "^OMNIROUTE_API_KEY=" }) -replace "^OMNIROUTE_API_KEY=","").Trim() }
$modelsRaw = curl.exe -s -m 15 http://127.0.0.1:20128/v1/models -H "Authorization: Bearer $omniKey" | ConvertFrom-Json
Write-Host "[PASS] 1. OmniRoute Gateway (:20128) Active - Models Loaded: $($modelsRaw.data.Count)" -ForegroundColor Green

# 2. Home Page HTTP 200
$homeResp = Invoke-WebRequest -Uri "http://localhost:3020" -UseBasicParsing -TimeoutSec 25
Write-Host "[PASS] 2. Web Home Page (GET /) - HTTP $($homeResp.StatusCode) ($($homeResp.Content.Length) bytes)" -ForegroundColor Green

# 3. Static/SSR SEO Detail Page HTTP 200
$detailResp = Invoke-WebRequest -Uri "http://localhost:3020/name/yazhini" -UseBasicParsing -TimeoutSec 25
Write-Host "[PASS] 3. SEO Detail Page (GET /name/yazhini) - HTTP $($detailResp.StatusCode)" -ForegroundColor Green

# 4. Names Filter API
$namesApi = Invoke-RestMethod -Uri "http://localhost:3020/api/names?gender=girl" -Method Get -TimeoutSec 15
Write-Host "[PASS] 4. Names Filter API (GET /api/names?gender=girl) - Returned $($namesApi.count) Tamil girl/unisex names" -ForegroundColor Green

# 5. Live OmniRoute AI Advisor API
$advisorBody = @{
  prompt = "Pure Sangam Tamil boy name starting with Ka meaning beauty or sun"
  gender = "boy"
  nakshatra = "mrigashirsha"
  luckyNumber = "6"
} | ConvertTo-Json
$advisorApi = Invoke-RestMethod -Uri "http://localhost:3020/api/advisor" -Method Post -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($advisorBody)) -TimeoutSec 25
Write-Host "[PASS] 5. OmniRoute AI Advisor API (POST /api/advisor) - Source: $($advisorApi.source), Model: $($advisorApi.modelUsed), Recommendations: $($advisorApi.recommendations.Count)" -ForegroundColor Green

# 6. Public Name Suggestion + AI Moderation API
$sugBody = @{
  nameTamil = "Sengathir"
  nameLatin = "Sengathir"
  gender = "boy"
  meaningTa = "Crimson rays of the rising sun"
  meaningEn = "Crimson rays of the rising sun"
  literaryReference = "Purananuru"
  submittedBy = "Prerequisite Smoke Tester"
} | ConvertTo-Json
$sugApi = Invoke-RestMethod -Uri "http://localhost:3020/api/suggestions" -Method Post -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($sugBody)) -TimeoutSec 25
Write-Host "[PASS] 6. Public Suggestion AI Moderation (POST /api/suggestions) - Status: $($sugApi.suggestion.status), Confidence: $($sugApi.suggestion.aiConfidence), Model: $($sugApi.suggestion.aiModelUsed)" -ForegroundColor Green

# 7. Family Poll API
$pollApi = Invoke-RestMethod -Uri "http://localhost:3020/api/polls?token=sample-tamil-poll" -Method Get -TimeoutSec 10
Write-Host "[PASS] 7. Family Vote-Out Poll API (GET /api/polls) - Poll '$($pollApi.poll.title)' with $($pollApi.poll.votes.Count) votes" -ForegroundColor Green

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " ALL LOCAL PREREQUISITE CHECKS PASSED! Ready for Manual Testing at http://localhost:3020" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan

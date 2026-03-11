#!/usr/bin/env pwsh

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Rava Kids Center - Server Setup & Start" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Change to server directory
Set-Location supabase/functions/server

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Starting server with Nodemon..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

Read-Host "Press Enter to exit"

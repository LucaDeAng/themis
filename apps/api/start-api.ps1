# Start Themis API Server
Write-Host "🚀 Starting Themis API Server..." -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Start the server
node dist\main.js

# Keep the window open if there's an error
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Server stopped with error code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Press any key to close..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

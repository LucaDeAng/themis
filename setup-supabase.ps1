# Themis Supabase Setup Script
# This script helps you configure Supabase for the Themis project

Write-Host "🚀 Themis Supabase Setup" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Setup Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com and sign up/login" -ForegroundColor White
Write-Host "2. Click 'New Project'" -ForegroundColor White
Write-Host "3. Name it 'themis', choose a region, and set a strong password" -ForegroundColor White
Write-Host "4. Wait 2-3 minutes for project creation" -ForegroundColor White
Write-Host "5. Go to Settings → Database → Connection string (URI)" -ForegroundColor White
Write-Host "6. Copy your connection string`n" -ForegroundColor White

Write-Host "Your connection string looks like:" -ForegroundColor Yellow
Write-Host "postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres`n" -ForegroundColor Gray

# Prompt for connection string
$connectionString = Read-Host "Enter your Supabase connection string"

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "`n❌ No connection string provided. Exiting." -ForegroundColor Red
    exit 1
}

# Validate connection string format
if ($connectionString -notmatch "^postgresql://") {
    Write-Host "`n❌ Invalid connection string format. Must start with 'postgresql://'" -ForegroundColor Red
    exit 1
}

# Update .env file
Write-Host "`n📝 Updating .env file..." -ForegroundColor Cyan
$envContent = Get-Content ".env" -Raw
$envContent = $envContent -replace 'DATABASE_URL=".*?"', "DATABASE_URL=`"$connectionString`""
Set-Content ".env" -Value $envContent

Write-Host "✅ .env file updated!`n" -ForegroundColor Green

# Enable pgvector extension
Write-Host "🔧 Next, enable pgvector extension in Supabase:" -ForegroundColor Yellow
Write-Host "1. In Supabase, go to SQL Editor" -ForegroundColor White
Write-Host "2. Click 'New query'" -ForegroundColor White
Write-Host "3. Copy and run this SQL:`n" -ForegroundColor White

$sql = @"
-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable uuid extension  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions
SELECT extname, extversion FROM pg_extension 
WHERE extname IN ('vector', 'uuid-ossp');
"@

Write-Host $sql -ForegroundColor Gray
Write-Host "`n"

# Copy SQL to clipboard
$sql | Set-Clipboard
Write-Host "✅ SQL copied to clipboard! Paste it in Supabase SQL Editor.`n" -ForegroundColor Green

Read-Host "Press Enter once you've run the SQL in Supabase"

# Generate Prisma Client
Write-Host "`n🔨 Generating Prisma Client..." -ForegroundColor Cyan
pnpm run prisma:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed. Check your connection string." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prisma Client generated!`n" -ForegroundColor Green

# Run migrations
Write-Host "🚀 Running database migrations..." -ForegroundColor Cyan
pnpm run prisma:migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed. Check your connection and try again." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Database migrations complete!`n" -ForegroundColor Green

# Test Gen AI
Write-Host "🤖 Testing Gen AI layer..." -ForegroundColor Cyan
Write-Host "Running: npx tsx test-gen-ai.ts`n" -ForegroundColor Gray

npx tsx test-gen-ai.ts

Write-Host "`n✨ Setup Complete!" -ForegroundColor Green
Write-Host "==================`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. View your database: pnpm run prisma:studio" -ForegroundColor White
Write-Host "2. Read documentation: NEXT_STEPS.md" -ForegroundColor White
Write-Host "3. Build the API: See task #9 in TODO list`n" -ForegroundColor White

Write-Host "🎉 Your Themis Gen AI engine is ready!" -ForegroundColor Cyan

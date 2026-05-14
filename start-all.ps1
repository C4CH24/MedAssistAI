Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🚀 MEDASSISTAI - HEALTHCARE MANAGEMENT SYSTEM           ║" -ForegroundColor Cyan
Write-Host "║           Starting Full Application Stack...                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists and has MONGODB_URI
Write-Host "📊 Checking MongoDB configuration..." -ForegroundColor Yellow
$envFile = Join-Path $PSScriptRoot "server\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    if ($envContent -match 'MONGODB_URI=mongodb\+srv://') {
        Write-Host "   ✅ MongoDB Atlas configured in .env" -ForegroundColor Green
    } elseif ($envContent -match 'MONGODB_URI=mongodb://') {
        Write-Host "   ✅ Local MongoDB configured in .env" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MONGODB_URI not found in server\.env" -ForegroundColor Yellow
        Write-Host "   Please ensure MONGODB_URI is set in server\.env" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  .env file not found in server directory" -ForegroundColor Yellow
}

Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '📡 BACKEND SERVER' -ForegroundColor Green; npm run dev"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start Fadhili AI
Write-Host "🤖 Starting Fadhili AI Service..." -ForegroundColor Yellow
$fadhiliPath = Join-Path $PSScriptRoot "fadhili-ai"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fadhiliPath'; Write-Host '🤖 FADHILI AI SERVICE' -ForegroundColor Green; npm start"

# Wait a moment for Fadhili AI to initialize
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend Client..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🖥️  FRONTEND CLIENT' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ ALL SYSTEMS GO! Your application is starting...       ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "║   📱 Frontend: http://localhost:3000                        ║" -ForegroundColor White
Write-Host "║   🔧 Backend API: http://localhost:5003                     ║" -ForegroundColor White
Write-Host "║   💊 Health Check: http://localhost:5003/api/health         ║" -ForegroundColor White
Write-Host "║   🤖 Fadhili AI: http://localhost:5001/health              ║" -ForegroundColor White
Write-Host "║   ☁️  Database: Local MongoDB (localhost)                   ║" -ForegroundColor White
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green

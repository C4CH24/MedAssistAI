Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🔍 MEDASSISTAI - COMPLETE PROJECT AUDIT                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$warnings = @()
$missing = @()

# Helper function to avoid colon in strings
function Write-Status {
    param(
        [string]$Symbol,
        [string]$Message,
        [string]$Color
    )
    Write-Host "   $Symbol $Message" -ForegroundColor $Color
}

# =============================================
# 1. BACKEND STRUCTURE CHECK
# =============================================
Write-Host "`n📁 Checking Backend Structure..." -ForegroundColor Yellow

$backendDirs = @(
    "server\src\controllers",
    "server\src\models",
    "server\src\routes",
    "server\src\middleware",
    "server\src\services",
    "server\src\utils",
    "server\src\config",
    "server\src\jobs",
    "server\src\validators"
)

foreach ($dir in $backendDirs) {
    if (Test-Path $dir) {
        Write-Status -Symbol "✅" -Message $dir -Color "Green"
    } else {
        Write-Status -Symbol "❌" -Message "$dir - MISSING" -Color "Red"
        $missing += $dir
    }
}

# =============================================
# 2. BACKEND REQUIRED FILES CHECK
# =============================================
Write-Host "`n📄 Checking Backend Required Files..." -ForegroundColor Yellow

$backendFiles = @(
    @{Path="server\server.js"; Desc="Main server file"},
    @{Path="server\.env"; Desc="Environment configuration"},
    @{Path="server\package.json"; Desc="Package manifest"},
    @{Path="server\src\models\User.js"; Desc="User model"},
    @{Path="server\src\models\Medication.js"; Desc="Medication model"},
    @{Path="server\src\models\Reminder.js"; Desc="Reminder model"},
    @{Path="server\src\models\AILog.js"; Desc="AI Log model"},
    @{Path="server\src\controllers\auth.controller.js"; Desc="Auth controller"},
    @{Path="server\src\controllers\medication.controller.js"; Desc="Medication controller"},
    @{Path="server\src\routes\auth.routes.js"; Desc="Auth routes"},
    @{Path="server\src\routes\user.routes.js"; Desc="User routes"},
    @{Path="server\src\routes\medication.routes.js"; Desc="Medication routes"},
    @{Path="server\src\routes\reminder.routes.js"; Desc="Reminder routes"},
    @{Path="server\src\routes\ai.routes.js"; Desc="AI routes"},
    @{Path="server\src\routes\health.routes.js"; Desc="Health routes"},
    @{Path="server\src\middleware\auth.middleware.js"; Desc="Auth middleware"},
    @{Path="server\src\middleware\error.middleware.js"; Desc="Error middleware"},
    @{Path="server\src\middleware\notFound.middleware.js"; Desc="404 middleware"},
    @{Path="server\src\services\sms.service.js"; Desc="SMS service"},
    @{Path="server\src\services\reminder.service.js"; Desc="Reminder service"},
    @{Path="server\src\services\ai.service.js"; Desc="AI service"},
    @{Path="server\src\utils\generateToken.js"; Desc="Token utility"},
    @{Path="server\src\utils\errorResponse.js"; Desc="Error response utility"},
    @{Path="server\src\utils\logger.js"; Desc="Logger utility"}
)

foreach ($file in $backendFiles) {
    if (Test-Path $file.Path) {
        $size = (Get-Item $file.Path).Length
        Write-Status -Symbol "✅" -Message "$($file.Path) ($size bytes)" -Color "Green"
    } else {
        Write-Status -Symbol "❌" -Message "$($file.Path) - $($file.Desc) MISSING" -Color "Red"
        $missing += "$($file.Path) ($($file.Desc))"
    }
}

# =============================================
# 3. FRONTEND STRUCTURE CHECK
# =============================================
Write-Host "`n📁 Checking Frontend Structure..." -ForegroundColor Yellow

$frontendDirs = @(
    "client\src\components",
    "client\src\components\layout",
    "client\src\components\ui",
    "client\src\pages",
    "client\src\pages\auth",
    "client\src\pages\dashboard",
    "client\src\pages\medications",
    "client\src\context",
    "client\src\services",
    "client\src\utils",
    "client\src\hooks",
    "client\src\styles"
)

foreach ($dir in $frontendDirs) {
    if (Test-Path $dir) {
        Write-Status -Symbol "✅" -Message $dir -Color "Green"
    } else {
        Write-Status -Symbol "❌" -Message "$dir - MISSING" -Color "Red"
        $missing += $dir
    }
}

# =============================================
# 4. FRONTEND REQUIRED FILES CHECK
# =============================================
Write-Host "`n📄 Checking Frontend Required Files..." -ForegroundColor Yellow

$frontendFiles = @(
    @{Path="client\src\App.jsx"; Desc="Main App component"},
    @{Path="client\src\main.jsx"; Desc="Entry point"},
    @{Path="client\src\index.css"; Desc="Global styles"},
    @{Path="client\src\components\layout\Layout.jsx"; Desc="Layout component"},
    @{Path="client\src\components\layout\Navbar.jsx"; Desc="Navbar component"},
    @{Path="client\src\components\layout\Sidebar.jsx"; Desc="Sidebar component"},
    @{Path="client\src\components\layout\Footer.jsx"; Desc="Footer component"},
    @{Path="client\src\components\PrivateRoute.jsx"; Desc="Private route wrapper"},
    @{Path="client\src\pages\auth\Login.jsx"; Desc="Login page"},
    @{Path="client\src\pages\auth\Register.jsx"; Desc="Register page"},
    @{Path="client\src\pages\auth\Auth.css"; Desc="Auth styles"},
    @{Path="client\src\pages\dashboard\Dashboard.jsx"; Desc="Dashboard page"},
    @{Path="client\src\pages\dashboard\Dashboard.css"; Desc="Dashboard styles"},
    @{Path="client\src\pages\medications\Medications.jsx"; Desc="Medications page"},
    @{Path="client\src\pages\medications\AddMedication.jsx"; Desc="Add medication page"},
    @{Path="client\src\context\AuthContext.jsx"; Desc="Auth context"},
    @{Path="client\src\context\LanguageContext.jsx"; Desc="Language context"},
    @{Path="client\src\context\NotificationContext.jsx"; Desc="Notification context"},
    @{Path="client\src\services\api.js"; Desc="API service"},
    @{Path="client\src\services\auth.service.js"; Desc="Auth service"},
    @{Path="client\src\services\medication.service.js"; Desc="Medication service"},
    @{Path="client\src\services\reminder.service.js"; Desc="Reminder service"},
    @{Path="client\src\utils\constants.js"; Desc="Constants"},
    @{Path="client\src\utils\helpers.js"; Desc="Helpers"},
    @{Path="client\src\hooks\useAuth.js"; Desc="Auth hook"},
    @{Path="client\src\hooks\useFetch.js"; Desc="Fetch hook"},
    @{Path="client\src\styles\global.css"; Desc="Global styles"},
    @{Path="client\src\styles\theme.js"; Desc="Theme configuration"},
    @{Path="client\package.json"; Desc="Frontend package manifest"}
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file.Path) {
        $size = (Get-Item $file.Path).Length
        Write-Status -Symbol "✅" -Message "$($file.Path) ($size bytes)" -Color "Green"
    } else {
        Write-Status -Symbol "❌" -Message "$($file.Path) - $($file.Desc) MISSING" -Color "Red"
        $missing += "$($file.Path) ($($file.Desc))"
    }
}

# =============================================
# 5. ENVIRONMENT CONFIGURATION CHECK
# =============================================
Write-Host "`n🔧 Checking Environment Configuration..." -ForegroundColor Yellow

if (Test-Path "server\.env") {
    $envContent = Get-Content "server\.env" -Raw
    $requiredEnvVars = @("MONGODB_URI", "JWT_SECRET", "PORT")
    
    foreach ($var in $requiredEnvVars) {
        if ($envContent -match "$var=") {
            Write-Status -Symbol "✅" -Message "$var configured" -Color "Green"
        } else {
            Write-Status -Symbol "❌" -Message "$var MISSING in .env" -Color "Red"
            $issues += "$var missing in server\.env"
        }
    }
    
    if ($envContent -match "MONGODB_URI=mongodb\+srv://") {
        Write-Status -Symbol "✅" -Message "MongoDB Atlas configured" -Color "Green"
    } else {
        Write-Status -Symbol "⚠️" -Message "MongoDB URI might be local (not Atlas)" -Color "Yellow"
        $warnings += "MongoDB might be using local connection"
    }
} else {
    Write-Status -Symbol "❌" -Message "server\.env file MISSING" -Color "Red"
    $missing += "server\.env"
}

# =============================================
# 6. PACKAGE.JSON DEPENDENCIES CHECK
# =============================================
Write-Host "`n📦 Checking Package Dependencies..." -ForegroundColor Yellow

if (Test-Path "server\package.json") {
    $backendPkg = Get-Content "server\package.json" | ConvertFrom-Json
    $requiredBackendDeps = @("express", "mongoose", "dotenv", "jsonwebtoken", "bcryptjs", "cors", "helmet")
    
    Write-Host "   Backend dependencies:" -ForegroundColor Cyan
    foreach ($dep in $requiredBackendDeps) {
        if ($backendPkg.dependencies.$dep) {
            Write-Status -Symbol "✅" -Message "$dep $($backendPkg.dependencies.$dep)" -Color "Green"
        } else {
            Write-Status -Symbol "❌" -Message "$dep - MISSING" -Color "Red"
            $issues += "Backend missing dependency: $dep"
        }
    }
} else {
    Write-Status -Symbol "❌" -Message "server\package.json MISSING" -Color "Red"
    $missing += "server\package.json"
}

if (Test-Path "client\package.json") {
    $frontendPkg = Get-Content "client\package.json" | ConvertFrom-Json
    $requiredFrontendDeps = @("react", "react-dom", "react-router-dom", "axios")
    
    Write-Host "`n   Frontend dependencies:" -ForegroundColor Cyan
    foreach ($dep in $requiredFrontendDeps) {
        if ($frontendPkg.dependencies.$dep) {
            Write-Status -Symbol "✅" -Message "$dep $($frontendPkg.dependencies.$dep)" -Color "Green"
        } else {
            Write-Status -Symbol "❌" -Message "$dep - MISSING" -Color "Red"
            $issues += "Frontend missing dependency: $dep"
        }
    }
} else {
    Write-Status -Symbol "❌" -Message "client\package.json MISSING" -Color "Red"
    $missing += "client\package.json"
}

# =============================================
# 7. ROUTES CHECK
# =============================================
Write-Host "`n🛣️  Checking Route Files..." -ForegroundColor Yellow

$expectedRoutes = @{
    "auth" = "auth.routes.js"
    "user" = "user.routes.js"
    "medication" = "medication.routes.js"
    "reminder" = "reminder.routes.js"
    "ai" = "ai.routes.js"
    "health" = "health.routes.js"
}

foreach ($route in $expectedRoutes.Keys) {
    $routeFile = "server\src\routes\$($expectedRoutes[$route])"
    if (Test-Path $routeFile) {
        Write-Status -Symbol "✅" -Message "$($expectedRoutes[$route]) exists" -Color "Green"
    } else {
        Write-Status -Symbol "❌" -Message "$($expectedRoutes[$route]) MISSING" -Color "Red"
        $missing += "$($expectedRoutes[$route])"
    }
}

# =============================================
# 8. MODEL CHECK
# =============================================
Write-Host "`n📊 Checking Models..." -ForegroundColor Yellow

$models = @("User.js", "Medication.js", "Reminder.js", "AILog.js")
foreach ($model in $models) {
    $modelPath = "server\src\models\$model"
    if (Test-Path $modelPath) {
        $content = Get-Content $modelPath -Raw
        if ($content -match "mongoose.Schema") {
            Write-Status -Symbol "✅" -Message "$model - valid schema" -Color "Green"
        } else {
            Write-Status -Symbol "⚠️" -Message "$model - might be incomplete" -Color "Yellow"
            $warnings += "$model might be incomplete"
        }
    } else {
        Write-Status -Symbol "❌" -Message "$model - MISSING" -Color "Red"
        $missing += $model
    }
}

# =============================================
# 9. SUMMARY REPORT
# =============================================
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    AUDIT SUMMARY REPORT                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($missing.Count -eq 0) {
    Write-Host "✅ NO MISSING FILES!" -ForegroundColor Green
} else {
    Write-Host "❌ MISSING FILES ($($missing.Count)):" -ForegroundColor Red
    foreach ($item in $missing) {
        Write-Host "   • $item" -ForegroundColor Red
    }
}

if ($issues.Count -eq 0) {
    Write-Host "`n✅ NO CRITICAL ISSUES!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  CRITICAL ISSUES ($($issues.Count)):" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host "   • $issue" -ForegroundColor Yellow
    }
}

if ($warnings.Count -eq 0) {
    Write-Host "`n✅ NO WARNINGS!" -ForegroundColor Green
} else {
    Write-Host "`n🔔 WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

# =============================================
# 10. NEXT STEPS
# =============================================
Write-Host "`n📋 RECOMMENDED NEXT STEPS:" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

if ($missing.Count -gt 0) {
    Write-Host "1️⃣  Create missing files listed above" -ForegroundColor Yellow
}
if ($issues.Count -gt 0) {
    Write-Host "2️⃣  Fix critical issues listed above" -ForegroundColor Yellow
}
if ($warnings.Count -gt 0) {
    Write-Host "3️⃣  Review and address warnings" -ForegroundColor Yellow
}

Write-Host "4️⃣  Run 'npm install' in both server and client directories" -ForegroundColor Green
Write-Host "5️⃣  Start backend: cd server && npm run dev" -ForegroundColor Green
Write-Host "6️⃣  Start frontend: cd client && npm run dev" -ForegroundColor Green
Write-Host "7️⃣  Access app at http://localhost:5173" -ForegroundColor Green
Write-Host "8️⃣  Test login with: 712345678 / 123456" -ForegroundColor Green

Write-Host "`n✅ Audit complete!" -ForegroundColor Green

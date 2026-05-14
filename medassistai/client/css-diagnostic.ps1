Write-Host "?? CSS/TAILWIND DIAGNOSTIC TOOL" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check package.json for Tailwind dependencies
Write-Host "1. Checking package.json for Tailwind dependencies..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

$tailwindPackages = @("tailwindcss", "postcss", "autoprefixer")
foreach ($pkg in $tailwindPackages) {
    if ($packageJson.devDependencies.$pkg -or $packageJson.dependencies.$pkg) {
        Write-Host "   ? $pkg is installed" -ForegroundColor Green
    } else {
        Write-Host "   ? $pkg is NOT installed" -ForegroundColor Red
    }
}
Write-Host ""

# 2. Check if tailwind.config.js exists and has content
Write-Host "2. Checking Tailwind configuration files..." -ForegroundColor Yellow
if (Test-Path "tailwind.config.js") {
    Write-Host "   ? tailwind.config.js exists" -ForegroundColor Green
    $tailwindContent = Get-Content "tailwind.config.js" -Raw
    if ($tailwindContent -match "content:.*?\[.*?\]") {
        Write-Host "   ? content paths are configured" -ForegroundColor Green
    } else {
        Write-Host "   ? content paths missing in tailwind.config.js" -ForegroundColor Red
    }
} else {
    Write-Host "   ? tailwind.config.js is MISSING" -ForegroundColor Red
}

if (Test-Path "postcss.config.js") {
    Write-Host "   ? postcss.config.js exists" -ForegroundColor Green
} else {
    Write-Host "   ? postcss.config.js is MISSING" -ForegroundColor Red
}
Write-Host ""

# 3. Check index.css for Tailwind directives
Write-Host "3. Checking src/index.css for Tailwind directives..." -ForegroundColor Yellow
if (Test-Path "src/index.css") {
    $indexCss = Get-Content "src/index.css" -Raw
    if ($indexCss -match "@tailwind base") {
        Write-Host "   ? @tailwind base found" -ForegroundColor Green
    } else {
        Write-Host "   ? @tailwind base MISSING" -ForegroundColor Red
    }
    if ($indexCss -match "@tailwind components") {
        Write-Host "   ? @tailwind components found" -ForegroundColor Green
    } else {
        Write-Host "   ? @tailwind components MISSING" -ForegroundColor Red
    }
    if ($indexCss -match "@tailwind utilities") {
        Write-Host "   ? @tailwind utilities found" -ForegroundColor Green
    } else {
        Write-Host "   ? @tailwind utilities MISSING" -ForegroundColor Red
    }
} else {
    Write-Host "   ? src/index.css is MISSING" -ForegroundColor Red
}
Write-Host ""

# 4. Check if main.jsx imports index.css
Write-Host "4. Checking if main.jsx imports index.css..." -ForegroundColor Yellow
if (Test-Path "src/main.jsx") {
    $mainJsx = Get-Content "src/main.jsx" -Raw
    if ($mainJsx -match "import.*?\.\/index\.css") {
        Write-Host "   ? index.css is imported in main.jsx" -ForegroundColor Green
    } else {
        Write-Host "   ? index.css is NOT imported in main.jsx" -ForegroundColor Red
    }
} else {
    Write-Host "   ? src/main.jsx is MISSING" -ForegroundColor Red
}
Write-Host ""

# 5. Check if Dashboard component is using Tailwind classes
Write-Host "5. Checking Dashboard component for Tailwind classes..." -ForegroundColor Yellow
if (Test-Path "src/pages/dashboard/Dashboard.jsx") {
    $dashboard = Get-Content "src/pages/dashboard/Dashboard.jsx" -Raw
    $tailwindClasses = @("bg-gray-50", "rounded-xl", "shadow-sm", "p-6", "text-3xl", "font-bold")
    $foundClasses = 0
    foreach ($class in $tailwindClasses) {
        if ($dashboard -match $class) {
            $foundClasses++
        }
    }
    Write-Host "   Found $foundClasses out of $($tailwindClasses.Count) common Tailwind classes" -ForegroundColor Yellow
    if ($foundClasses -gt 3) {
        Write-Host "   ? Dashboard is using Tailwind classes" -ForegroundColor Green
    } else {
        Write-Host "   ? Dashboard may not be using Tailwind classes properly" -ForegroundColor Red
    }
} else {
    Write-Host "   ? Dashboard component is MISSING" -ForegroundColor Red
}
Write-Host ""

# 6. Check if Vite is processing CSS properly
Write-Host "6. Checking Vite configuration..." -ForegroundColor Yellow
if (Test-Path "vite.config.js") {
    $viteConfig = Get-Content "vite.config.js" -Raw
    Write-Host "   ? vite.config.js exists" -ForegroundColor Green
} else {
    Write-Host "   ? vite.config.js is MISSING" -ForegroundColor Red
}
Write-Host ""

# 7. Check browser console for CSS errors (manual step)
Write-Host "7. MANUAL CHECK REQUIRED:" -ForegroundColor Magenta
Write-Host "   Open your browser at http://localhost:3000" -ForegroundColor White
Write-Host "   Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "   Go to the 'Network' tab and refresh the page" -ForegroundColor White
Write-Host "   Look for any CSS files failing to load (shown in red)" -ForegroundColor White
Write-Host "   Go to the 'Console' tab and check for any CSS-related errors" -ForegroundColor White
Write-Host ""

# 8. Recommendations
Write-Host "?? RECOMMENDATIONS BASED ON FINDINGS:" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Provide recommendations based on findings
if (-not (Test-Path "tailwind.config.js") -or -not (Test-Path "postcss.config.js")) {
    Write-Host "? Run this to create missing config files:" -ForegroundColor Red
    Write-Host "   npm install -D tailwindcss postcss autoprefixer" -ForegroundColor Yellow
    Write-Host "   npx tailwindcss init -p" -ForegroundColor Yellow
}

$indexCss = if (Test-Path "src/index.css") { Get-Content "src/index.css" -Raw } else { "" }
if ($indexCss -notmatch "@tailwind") {
    Write-Host "? Fix src/index.css by adding:" -ForegroundColor Red
    Write-Host "   @tailwind base;" -ForegroundColor Yellow
    Write-Host "   @tailwind components;" -ForegroundColor Yellow
    Write-Host "   @tailwind utilities;" -ForegroundColor Yellow
}

if (-not (Test-Path "src/main.jsx") -or ($mainJsx -notmatch "import.*index\.css")) {
    Write-Host "? Add this to src/main.jsx:" -ForegroundColor Red
    Write-Host "   import './index.css';" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "?? QUICK FIX COMMAND (run this):" -ForegroundColor Green
Write-Host "   .\fix-css.ps1" -ForegroundColor White

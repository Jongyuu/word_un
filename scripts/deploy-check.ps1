# 部署前检查脚本
Write-Host "🔍 执行部署前检查..." -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

# 1. 检查构建
Write-Host "1. 检查构建产物..." -NoNewline
if (Test-Path "dist/index.html") {
    Write-Host " ✓ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ✗ 失败 - 请运行 npm run build" -ForegroundColor Red
    $failed++
}

# 2. 检查环境变量
Write-Host "2. 检查环境变量..." -NoNewline
if (Test-Path ".env.local") {
    Write-Host " ✓ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ⚠ 警告 - .env.local 不存在" -ForegroundColor Yellow
    $passed++
}

# 3. 检查 vercel.json
Write-Host "3. 检查 Vercel 配置..." -NoNewline
if (Test-Path "vercel.json") {
    Write-Host " ✓ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ✗ 失败" -ForegroundColor Red
    $failed++
}

# 4. 检查 package.json
Write-Host "4. 检查 package.json..." -NoNewline
$pkg = Get-Content "package.json" | ConvertFrom-Json
if ($pkg.scripts.build) {
    Write-Host " ✓ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ✗ 失败 - 缺少 build 脚本" -ForegroundColor Red
    $failed++
}

# 5. 检查数据文件
Write-Host "5. 检查数据文件..." -NoNewline
if ((Test-Path "supabase/seed-data/nodes-all.json") -and (Test-Path "supabase/seed-data/relations.json")) {
    Write-Host " ✓ 通过" -ForegroundColor Green
    $passed++
} else {
    Write-Host " ✗ 失败" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "检查结果: " -NoNewline
Write-Host "$passed 通过" -NoNewline -ForegroundColor Green
Write-Host ", " -NoNewline
Write-Host "$failed 失败" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "✅ 所有检查通过，可以部署！" -ForegroundColor Green
} else {
    Write-Host "❌ 部分检查失败，请修复后再部署" -ForegroundColor Red
}

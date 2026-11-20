#requires -Version 5.1
# 部署自动化脚本：本地构建 VitePress 站点 -> 外链检查 -> 打包 dist -> 可选上传到自有服务器。
#
# 运行环境：本机 Windows / Node 22；服务器不跑 Node，只接收静态产物由 Nginx 发布。
# 默认仅完成构建、检查与打包；上传需显式开启并提供服务器连接信息。
#
# 连接信息优先级：同名环境变量 > 下方脚本内默认值。
#   DEPLOY_UPLOAD        设为 "true" 才执行上传；默认 "false"（只构建打包）
#   DEPLOY_SSH_USER     SSH 登录用户
#   DEPLOY_SSH_HOST     SSH 主机 / IP
#   DEPLOY_REMOTE_PATH  Nginx 站点根目录，例如 /var/www/docs（docs.madongdong.com）
#   DEPLOY_SSH_KEY      可选，私钥路径；不配则使用本机默认密钥
#
# 远端解压：优先 unzip；未安装时回退 python3 -m zipfile（两者任一可用即可）。
# 打包归档名统一使用正斜杠，避免 Windows Compress-Archive 的反斜杠在 Linux 上
# 解压成扁平文件名。
#
# 用法（项目根目录）：
#   pwsh scripts/deploy.ps1                       # 构建 + 检查 + 打包
#   $env:DEPLOY_UPLOAD="true"; pwsh scripts/deploy.ps1   # 构建并上传

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# === 部署配置 ===
# 注意：本脚本需兼容 Windows PowerShell 5.1，勿使用 PS7 专有的 `??` 空合并运算符。
function Coalesce($value, $fallback) {
  if ($null -ne $value -and $value -ne '') { return $value }
  return $fallback
}

$deploy = @{
  Upload     = (Coalesce $env:DEPLOY_UPLOAD 'false').ToString().ToLower() -eq 'true'
  SshUser    = Coalesce $env:DEPLOY_SSH_USER ''
  SshHost    = Coalesce $env:DEPLOY_SSH_HOST ''
  RemotePath = Coalesce $env:DEPLOY_REMOTE_PATH ''
  SshKey     = Coalesce $env:DEPLOY_SSH_KEY ''
}

$distDir     = Join-Path $root 'docs/.vitepress/dist'
$packageDir  = Join-Path $root 'deploy'
$timestamp   = Get-Date -Format 'yyyyMMdd-HHmmss'
$packageName = "madongdong-docs-$timestamp.zip"
$packagePath = Join-Path $packageDir $packageName

function Invoke-Step($title, $action) {
  Write-Host "`n=== $title ===" -ForegroundColor Cyan
  & $action
  if ($LASTEXITCODE -ne 0) {
    Write-Error "步骤失败：$title（退出码 $LASTEXITCODE）"
    exit $LASTEXITCODE
  }
}

# 1) 安装依赖（如 node_modules 缺失）
if (-not (Test-Path (Join-Path $root 'node_modules'))) {
  Invoke-Step '安装依赖' { npm install --no-audit --no-fund }
}

# 2) 构建产物
Invoke-Step '构建站点' { npm run docs:build }

# 3) 产物外链检查（离线发布基线）
Invoke-Step '外链检查' { & (Join-Path $root 'scripts/build-check.ps1') }

# 4) 打包 dist
if (Test-Path $packageDir) { Remove-Item $packageDir -Recurse -Force }
New-Item -ItemType Directory -Path $packageDir | Out-Null
if (-not (Test-Path $distDir)) {
  Write-Error "dist 目录不存在：$distDir"
  exit 1
}
# 不能用 Compress-Archive：它在 Windows 上把归档名写成反斜杠，
# Linux 解压会变成带反斜杠的扁平文件名。这里用 .NET ZipArchive 显式写
# 正斜杠归档名，保证远端（Linux unzip）目录树正确。
# 程序集名需同时兼容 PS7(.NET Core) 与 PS5.1(.NET Framework)：
# 5.1 下 ZipFile 类型位于 System.IO.Compression.FileSystem 程序集。
try {
  Add-Type -AssemblyName System.IO.Compression.ZipFile -ErrorAction Stop
} catch {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
}
Add-Type -AssemblyName System.IO.Compression
Write-Host "`n=== 打包产物 ===" -ForegroundColor Cyan
$zip = [System.IO.Compression.ZipFile]::Open($packagePath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Recurse -File $distDir | ForEach-Object {
    $rel = $_.FullName.Substring($distDir.Length).TrimStart('\', '/') -replace '\\', '/'
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel) | Out-Null
  }
} finally {
  $zip.Dispose()
}
Write-Host "已打包：$packagePath"

# 5) 可选：上传到服务器
if (-not $deploy.Upload) {
  Write-Host "`n未开启上传（DEPLOY_UPLOAD != true）。产物位于：$distDir" -ForegroundColor Yellow
  Write-Host "后续手动上传或将 DEPLOY_UPLOAD 置为 true 并填写服务器信息后重跑本脚本。"
  exit 0
}

$missing = @()
if (-not $deploy.SshHost)    { $missing += 'DEPLOY_SSH_HOST' }
if (-not $deploy.RemotePath) { $missing += 'DEPLOY_REMOTE_PATH' }
if ($missing.Count -gt 0) {
  Write-Error "开启上传但缺少配置：$($missing -join '、')"
  exit 1
}

$sshTarget = if ($deploy.SshUser) { "$($deploy.SshUser)@$($deploy.SshHost)" } else { $deploy.SshHost }
$sshArgs = @()
if ($deploy.SshKey) { $sshArgs += @('-i', $deploy.SshKey) }

Write-Host "`n=== 上传到 ${sshTarget}:$($deploy.RemotePath) ===" -ForegroundColor Cyan

# 5.1 上传压缩包到远端临时目录
$remoteZip = "/tmp/$packageName"
$scpArgs = if ($deploy.SshKey) { @('-i', $deploy.SshKey, $packagePath, "${sshTarget}:$remoteZip") } else { @($packagePath, "${sshTarget}:$remoteZip") }
& scp @scpArgs
if ($LASTEXITCODE -ne 0) { Write-Error 'SCP 上传失败'; exit $LASTEXITCODE }

# 5.2 远端：备份当前目录 -> 解压新版本 -> 清理临时包
$remoteScript = @"
set -e
TARGET='$($deploy.RemotePath)'
mkdir -p `"`$TARGET`"
BACKUP=`"$TARGET.bak-$timestamp`"
if [ -d `"`$TARGET`" ] && [ "`$`(ls -A `"`$TARGET`" 2>/dev/null)" ]; then
  cp -r `"`$TARGET`" `"`$BACKUP`"
fi
rm -rf `"`$TARGET`"/*
if command -v unzip >/dev/null 2>&1; then
  unzip -q -o '$remoteZip' -d `"`$TARGET`"
else
  python3 -m zipfile -e '$remoteZip' `"`$TARGET`"
fi
rm -f '$remoteZip'
echo "发布完成：`$TARGET（备份：`$BACKUP）"
"@

& ssh @sshArgs $sshTarget $remoteScript
if ($LASTEXITCODE -ne 0) { Write-Error '远端解压/发布失败'; exit $LASTEXITCODE }

Write-Host "`n部署完成。" -ForegroundColor Green

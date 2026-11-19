# 构建产物外链检查
# 用途：扫描 dist 中真正会发起外部请求的资源引用（HTML 的 src/href、CSS 的 url()/@import）。
# 说明：JS 第三方库内夹带的许可证/注释 URL 不发起网络请求，仅作信息展示，不计为失败。
# 用法：在项目根目录执行  pwsh scripts/build-check.ps1
param(
  [string]$Dist = "docs/.vitepress/dist"
)

$root = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $root $Dist

if (-not (Test-Path $distPath)) {
  Write-Error "dist 目录不存在，请先执行 npm run docs:build：$distPath"
  exit 1
}

# 1) 检查 HTML 中外部 src/href 资源引用
$htmlFiles = Get-ChildItem -Recurse -File $distPath -Include *.html
$externalRefs = @()
foreach ($f in $htmlFiles) {
  $text = Get-Content $f.FullName -Raw
  if (-not $text) { continue }
  foreach ($m in [regex]::Matches($text, '(?:src|href)="(https?://[^"]+)"')) {
    $externalRefs += [pscustomobject]@{ File = $f.Name; Ref = $m.Groups[1].Value }
  }
}

# 2) 检查 CSS 中外部 url() / @import
$cssFiles = Get-ChildItem -Recurse -File $distPath -Include *.css
foreach ($f in $cssFiles) {
  $text = Get-Content $f.FullName -Raw
  if (-not $text) { continue }
  foreach ($m in [regex]::Matches($text, 'url\(\s*[''"]?https?://[^''")\s]+')) {
    $externalRefs += [pscustomobject]@{ File = $f.Name; Ref = $m.Value }
  }
  foreach ($m in [regex]::Matches($text, '@import\s+https?://[^\s;]+')) {
    $externalRefs += [pscustomobject]@{ File = $f.Name; Ref = $m.Value }
  }
}

if ($externalRefs.Count -gt 0) {
  Write-Warning "发现外部资源引用，请确认是否为必需："
  $externalRefs | Format-Table -AutoSize
  exit 2
}

Write-Host "OK：HTML/CSS 中无外部资源引用，产物可离线发布。"

# 3) 信息展示：JS/其他文件中出现的 URL 主机（多为许可证/注释字符串）
$otherFiles = Get-ChildItem -Recurse -File $distPath -Include *.js, *.svg
$hosts = @{}
foreach ($f in $otherFiles) {
  $text = Get-Content $f.FullName -Raw
  if (-not $text) { continue }
  foreach ($m in [regex]::Matches($text, 'https?://([^/"''\s<>\\)]+)')) {
    $h = $m.Groups[1].Value
    if ($hosts.ContainsKey($h)) { $hosts[$h]++ } else { $hosts[$h] = 1 }
  }
}
if ($hosts.Count -gt 0) {
  Write-Host "`nJS/SVG 中夹带的 URL 主机（信息项，不发起请求）："
  $hosts.GetEnumerator() | Sort-Object Count -Descending | Format-Table Count, Name -AutoSize
}

exit 0

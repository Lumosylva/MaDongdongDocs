# 复制为 deploy.local.ps1，填写本机部署配置后双击根目录 deploy.bat。
$env:DEPLOY_UPLOAD = 'true'
$env:DEPLOY_SSH_HOST = 'your-server-host'
$env:DEPLOY_REMOTE_PATH = '/var/www/docs'
$env:DEPLOY_SSH_USER = 'your-ssh-user'

& (Join-Path $PSScriptRoot 'scripts/deploy.ps1')
exit $LASTEXITCODE

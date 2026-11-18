# deploy.ps1 – upload website to server
# Only ships the site's own files (html/css/js/images).
# Never uploads deploy.ps1, .git, .vscode, README, etc.

$remoteUser = "donniegonz"
$remoteHost = "donovans-server"
$remotePath = "/var/www/html"

$destination = "$remoteUser@$remoteHost" + ":" + $remotePath

$files = Get-ChildItem -Path "$PSScriptRoot\*" -File -Include *.html, *.css, *.js, *.jpeg, *.jpg, *.png, *.svg, *.ico

Write-Host "Deploying $($files.Count) files to $destination"
scp $files.FullName $destination
# Efficient Decrypto Project Packager
$ProjectRoot = "d:\decrypto-deploy-wizard"
$ZipPath = "d:\decrypto-deploy-wizard-submission.zip"
$TempDir = "$env:TEMP\decrypto_pack_v2"

# Clean up
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir -Force

# Use Robocopy for fast, filtered copying
$ExcludeDirs = "node_modules", ".next", "artifacts", "cache", ".git"
robocopy $ProjectRoot $TempDir /E /XD $ExcludeDirs /R:1 /W:1 /NFL /NDL

# Zip the clean copy
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath

# Cleanup
Remove-Item -Path $TempDir -Recurse -Force

Write-Host "Project successfully packaged into: $ZipPath"

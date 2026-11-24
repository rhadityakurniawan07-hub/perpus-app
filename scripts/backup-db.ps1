# PERPUS Database Backup Script (Windows PowerShell)
# Usage: .\scripts\backup-db.ps1 -BackupDir ".\backups"

param(
    [string]$BackupDir = ".\backups"
)

$ErrorActionPreference = "Stop"

# Load environment variables from .env
$envFile = "apps/api/.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
    $databaseUrl = "postgresql://postgres:postgres@localhost:5432/perpus_db"
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path $BackupDir "perpus_backup_${timestamp}.sql"

# Parse DATABASE_URL
# Format: postgresql://user:password@host:port/dbname
if ($databaseUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)') {
    $dbUser = $matches[1]
    $dbPass = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5] -replace '\?.*', ''
} else {
    Write-Host "❌ Invalid DATABASE_URL format" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Creating backup: $backupFile" -ForegroundColor Cyan

# Create backup directory
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $dbPass

# Run pg_dump
$pgDumpPath = "pg_dump"
$arguments = @("-h", $dbHost, "-p", $dbPort, "-U", $dbUser, "-d", $dbName, "-F", "c", "-f", $backupFile)

try {
    & $pgDumpPath @arguments
    $fileSize = (Get-Item $backupFile).Length / 1MB
    Write-Host "✅ Backup created: $backupFile" -ForegroundColor Green
    Write-Host "📊 Size: $($fileSize.ToString('F2')) MB" -ForegroundColor Green
} catch {
    Write-Host "❌ Backup failed: $_" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

# Keep only last 7 backups
Write-Host "🧹 Cleaning old backups (keeping last 7)..." -ForegroundColor Yellow
$backups = Get-ChildItem $BackupDir -Filter "perpus_backup_*.sql" | Sort-Object LastWriteTime -Descending
if ($backups.Count -gt 7) {
    $backups | Select-Object -Skip 7 | Remove-Item -Force
    Write-Host "✅ Old backups cleaned" -ForegroundColor Green
}

Write-Host "✅ Backup complete!" -ForegroundColor Green
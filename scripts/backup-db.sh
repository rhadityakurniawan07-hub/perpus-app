#!/bin/bash
# PERPUS Database Backup Script
# Usage: ./scripts/backup-db.sh [backup_dir]

set -e

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/perpus_backup_${TIMESTAMP}.sql"

# Load environment variables
if [ -f apps/api/.env ]; then
  export $(cat apps/api/.env | grep -v '^#' | xargs)
fi

DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/perpus_db}"

echo "📦 Creating backup: ${BACKUP_FILE}"

# Create backup directory if not exists
mkdir -p "${BACKUP_DIR}"

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/dbname
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Run pg_dump
PGPASSWORD="${DB_PASS}" pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -F c -f "${BACKUP_FILE}"

echo "✅ Backup created: ${BACKUP_FILE}"
echo "📊 Size: $(du -h "${BACKUP_FILE}" | cut -f1)"

# Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
ls -t "${BACKUP_DIR}"/perpus_backup_*.sql 2>/dev/null | tail -n +8 | xargs -r rm -f

echo "✅ Backup complete!"
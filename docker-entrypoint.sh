#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready…"
# Simple wait loop using prisma db push which handles connection retry
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database not ready yet, retrying in 3s…"
  sleep 3
done

echo "✅ Database is ready"
echo "🚀 Starting Next.js…"
exec "$@"

#!/bin/sh
# ══════════════════════════════════════════════════════════════════
# TuMotoTus Sueños — Script de arranque en producción
# 1. Crea los esquemas PostgreSQL si no existen
# 2. Sincroniza el schema de Prisma
# 3. Arranca NestJS
# ══════════════════════════════════════════════════════════════════
set -e

echo "🔧 Creando esquemas PostgreSQL..."
psql "$DATABASE_URL" <<-SQL
  CREATE SCHEMA IF NOT EXISTS plataforma;
  CREATE SCHEMA IF NOT EXISTS flota;
  CREATE SCHEMA IF NOT EXISTS marketplace;
  CREATE SCHEMA IF NOT EXISTS finanzas;
SQL

echo "📦 Sincronizando schema de Prisma..."
npx prisma db push --accept-data-loss

echo "🚀 Arrancando TuMotoTus Sueños API..."
exec node -r tsconfig-paths/register dist/src/main.js

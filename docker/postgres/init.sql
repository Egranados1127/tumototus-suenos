-- ══════════════════════════════════════════════════════════════════
-- TuMotoTus Sueños — Inicialización de Schemas PostgreSQL
-- ══════════════════════════════════════════════════════════════════

-- Schemas lógicos del negocio
CREATE SCHEMA IF NOT EXISTS plataforma;   -- usuarios, sesiones, auth
CREATE SCHEMA IF NOT EXISTS flota;        -- vehiculos, contratos, liquidaciones, documentos
CREATE SCHEMA IF NOT EXISTS marketplace;  -- comercios, pedidos, asignaciones
CREATE SCHEMA IF NOT EXISTS finanzas;     -- ingresos, resúmenes, reportes

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Role de aplicación (solo acceso a schemas de negocio, no superuser)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'tumoto_app') THEN
    CREATE ROLE tumoto_app WITH LOGIN PASSWORD 'app_secret_change_in_prod';
  END IF;
END
$$;

GRANT USAGE ON SCHEMA plataforma TO tumoto_app;
GRANT USAGE ON SCHEMA flota TO tumoto_app;
GRANT USAGE ON SCHEMA marketplace TO tumoto_app;
GRANT USAGE ON SCHEMA finanzas TO tumoto_app;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA plataforma TO tumoto_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA flota TO tumoto_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA marketplace TO tumoto_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA finanzas TO tumoto_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA plataforma GRANT ALL ON TABLES TO tumoto_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA flota GRANT ALL ON TABLES TO tumoto_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA marketplace GRANT ALL ON TABLES TO tumoto_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA finanzas GRANT ALL ON TABLES TO tumoto_app;

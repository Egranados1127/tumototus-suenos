# ══════════════════════════════════════════════════════════════════
# TuMotoTus Sueños — Script de inicio para desarrollo
# Uso: .\iniciar.ps1
# ══════════════════════════════════════════════════════════════════

Write-Host "🏍️  TuMotoTus Sueños — Iniciando entorno de desarrollo..." -ForegroundColor Cyan

# 1. Verificar que Docker Desktop esté corriendo
Write-Host "`n📦 Verificando Docker..." -ForegroundColor Yellow
$intentos = 0
do {
    $intentos++
    $dockerOk = docker info 2>&1 | Select-String "Server Version"
    if (-not $dockerOk) {
        if ($intentos -eq 1) {
            Write-Host "   Docker Desktop no está corriendo. Iniciando..." -ForegroundColor Yellow
            Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue
        }
        Write-Host "   Esperando Docker engine ($intentos/12)..." -ForegroundColor Gray
        Start-Sleep -Seconds 10
    }
} while (-not $dockerOk -and $intentos -lt 12)

if (-not $dockerOk) {
    Write-Host "❌ Docker Desktop no pudo iniciarse. Ábrelo manualmente y vuelve a ejecutar." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker listo" -ForegroundColor Green

# 2. Levantar infraestructura
Write-Host "`n🗄️  Levantando PostgreSQL, Redis y MinIO..." -ForegroundColor Yellow
docker compose up -d postgres redis minio
Start-Sleep -Seconds 8

# 3. Verificar que postgres esté saludable
Write-Host "`n⏳ Esperando que PostgreSQL esté listo..." -ForegroundColor Yellow
$pgListo = $false
for ($i = 1; $i -le 10; $i++) {
    $check = docker compose exec -T postgres pg_isready -U tumoto -d tumototus 2>&1
    if ($check -match "accepting connections") {
        $pgListo = $true
        break
    }
    Write-Host "   Intento $i/10..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
}

if (-not $pgListo) {
    Write-Host "⚠️  PostgreSQL tardó más de lo esperado. Verifica con: docker compose logs postgres" -ForegroundColor Yellow
}

Write-Host "`n✅ Infraestructura lista" -ForegroundColor Green
Write-Host "`n📋 Servicios disponibles:" -ForegroundColor Cyan
Write-Host "   PostgreSQL : localhost:5432  (usuario: tumoto, bd: tumototus)" -ForegroundColor White
Write-Host "   Redis      : localhost:6379" -ForegroundColor White
Write-Host "   MinIO      : http://localhost:9001 (consola admin)" -ForegroundColor White

Write-Host "`n🚀 Para continuar:" -ForegroundColor Cyan
Write-Host "   API  → cd apps\api && npm run prisma:migrate && npm run start:dev" -ForegroundColor White
Write-Host "   Web  → cd apps\web && npm run dev" -ForegroundColor White
Write-Host "`n   O usa dos terminales separadas para correr ambos en paralelo." -ForegroundColor Gray

// ══════════════════════════════════════════════════════════════════
// SEED — Datos iniciales para TuMotoTus Sueños
// Crea: admin + 6 motos de la flota inicial
// Uso: npm run prisma:seed
// ══════════════════════════════════════════════════════════════════

import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de TuMotoTus Sueños...\n');

  // ─── 1. ADMIN ──────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin2026!', 12);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@tumototus.com' },
    update: {},
    create: {
      email: 'admin@tumototus.com',
      passwordHash,
      rol: 'ADMIN',
      activo: true,
    },
  });
  console.log(`✅ Admin creado: ${admin.email}`);

  // ─── 2. FLOTA INICIAL — 6 MOTOS ───────────────────────────────
  const motas = [
    { placa: 'ABC123', marca: 'Honda',   modelo: 'CB 125F',     anio: 2022, cilindraje: 125, color: 'Rojo' },
    { placa: 'DEF456', marca: 'Yamaha',  modelo: 'SZ 150',      anio: 2023, cilindraje: 150, color: 'Negro' },
    { placa: 'GHI789', marca: 'Auteco',  modelo: 'Boxer 100',   anio: 2021, cilindraje: 100, color: 'Azul' },
    { placa: 'JKL012', marca: 'AKT',     modelo: 'TTR 125',     anio: 2022, cilindraje: 125, color: 'Verde' },
    { placa: 'MNO345', marca: 'Kymco',   modelo: 'Agility 125', anio: 2023, cilindraje: 125, color: 'Blanco' },
    { placa: 'PQR678', marca: 'Honda',   modelo: 'Eco Deluxe',  anio: 2021, cilindraje: 100, color: 'Rojo' },
  ];

  for (const moto of motas) {
    await prisma.vehiculo.upsert({
      where: { placa: moto.placa },
      update: {},
      create: {
        ...moto,
        estado: 'DISPONIBLE',
        odometroActual: 0,
      },
    });
    console.log(`  🏍️  ${moto.placa} — ${moto.marca} ${moto.modelo} (${moto.cilindraje}cc) — ${moto.color}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Seed completado exitosamente\n');
  console.log('📋 Credenciales de acceso:');
  console.log('   Email:    admin@tumototus.com');
  console.log('   Password: Admin2026!');
  console.log('\n⚠️  CAMBIA LA CONTRASEÑA DEL ADMIN ANTES DE PRODUCCIÓN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

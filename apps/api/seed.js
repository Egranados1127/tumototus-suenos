const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

async function seed() {
  const prisma = new PrismaClient();
  try {
    // ─── Admin ────────────────────────────────────────────────────
    const hash = await bcrypt.hash('Admin2026!', 12);
    await prisma.usuario.upsert({
      where: { email: 'admin@rodandosuenos.com' },
      update: {},
      create: {
        email: 'admin@rodandosuenos.com',
        passwordHash: hash,
        rol: 'ADMIN',
      },
    });
    console.log('✅ Admin creado: admin@rodandosuenos.com / Admin2026!');

    // ─── 6 Motos iniciales ────────────────────────────────────────
    const motos = [
      { placa: 'HND125A', marca: 'Honda',  modelo: 'CB 125F',       anio: 2022, cilindraje: 125, color: 'Rojo' },
      { placa: 'YMH150B', marca: 'Yamaha', modelo: 'SZ 150',        anio: 2021, cilindraje: 150, color: 'Negro' },
      { placa: 'BXR100C', marca: 'Boxer',  modelo: 'BM 100',        anio: 2020, cilindraje: 100, color: 'Azul' },
      { placa: 'AKT125D', marca: 'AKT',    modelo: 'TTR 125',       anio: 2023, cilindraje: 125, color: 'Verde' },
      { placa: 'KYM125E', marca: 'Kymco',  modelo: 'Agility 125',   anio: 2022, cilindraje: 125, color: 'Blanco' },
      { placa: 'HND100F', marca: 'Honda',  modelo: 'Eco Deluxe 100',anio: 2021, cilindraje: 100, color: 'Gris' },
    ];

    for (const m of motos) {
      await prisma.vehiculo.upsert({
        where: { placa: m.placa },
        update: {},
        create: { ...m, estado: 'DISPONIBLE', odometroActual: 0 },
      });
    }
    console.log('✅ 6 motos creadas:', motos.map(m => m.placa).join(', '));
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((e) => { console.error('❌ Seed error:', e); process.exit(1); });

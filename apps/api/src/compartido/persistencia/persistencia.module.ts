// ══════════════════════════════════════════════════════════════════
// COMPARTIDO — Módulo de Persistencia (Prisma)
// Expone PrismaClient como provider inyectable en toda la app
// ══════════════════════════════════════════════════════════════════

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PersistenciaModule {}

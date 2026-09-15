// ══════════════════════════════════════════════════════════════════
// COMPARTIDO — PrismaService
// Wrapper sobre PrismaClient con lifecycle hooks de NestJS
// ══════════════════════════════════════════════════════════════════

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
        // En desarrollo activa query logs:
        // { emit: 'stdout', level: 'query' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Conexión a PostgreSQL establecida');
    } catch (error) {
      this.logger.error('❌ No se pudo conectar a PostgreSQL', error);
      process.exit(1); // Fail-fast: sin BD no arranca
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Conexión a PostgreSQL cerrada (graceful shutdown)');
  }
}

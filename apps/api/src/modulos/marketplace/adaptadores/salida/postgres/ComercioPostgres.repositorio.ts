import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { ComercioRepositorioPort } from '@modulos/marketplace/puertos/salida/ComercioRepositorio.port';

@Injectable()
export class ComercioPostgresRepositorio implements ComercioRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(comercio: any): Promise<void> {
    await this.prisma.comercio.upsert({
      where: { id: comercio.id },
      update: comercio,
      create: comercio,
    });
  }

  async buscarPorId(id: string): Promise<any | null> {
    return this.prisma.comercio.findUnique({ where: { id } });
  }

  async buscarPorQrToken(qrToken: string): Promise<any | null> {
    return this.prisma.comercio.findUnique({ where: { qrToken } });
  }

  async listarActivos(): Promise<any[]> {
    return this.prisma.comercio.findMany({ where: { activo: true } });
  }
}

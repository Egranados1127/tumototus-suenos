import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { ConductorRepositorioPort } from '@modulos/contratos/puertos/salida/ConductorRepositorio.port';

@Injectable()
export class ConductorPostgresRepositorio implements ConductorRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string): Promise<{ id: string; nombre: string; activo: boolean } | null> {
    const p = await this.prisma.perfilConductor.findUnique({
      where: { id },
      include: { usuario: true },
    });
    if (!p) return null;
    return {
      id: p.id,
      nombre: `${p.nombres} ${p.apellidos}`,
      activo: p.usuario.activo,
    };
  }

  async tieneContratoActivo(conductorId: string): Promise<boolean> {
    const count = await this.prisma.contrato.count({
      where: {
        conductorId,
        estado: { in: ['ACTIVO', 'EN_MORA', 'SUSPENDIDO'] },
      },
    });
    return count > 0;
  }
}

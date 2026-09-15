import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';

@Injectable()
export class ObtenerMiContratoUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(usuarioId: string) {
    const perfil = await this.prisma.perfilConductor.findUnique({
      where: { usuarioId },
      include: {
        contratos: {
          where: { estado: { in: ['ACTIVO', 'EN_MORA'] } },
          include: { vehiculo: true },
        },
      },
    });

    if (!perfil || !perfil.contratos || perfil.contratos.length === 0) {
      throw new NotFoundException('No tienes ningún contrato activo en este momento.');
    }

    const contrato = perfil.contratos[0];

    return {
      contratoId: contrato.id,
      vehiculo: `${contrato.vehiculo.marca} ${contrato.vehiculo.modelo} (${contrato.vehiculoPlaca})`,
      fechaInicio: contrato.fechaInicio,
      plazoMeses: contrato.plazoMeses,
      cuotaDiaria: Number(contrato.cuotaDiaria),
      totalPagado: Number(contrato.totalPagado),
      saldoPendiente: Number(contrato.saldoPendiente),
      porcentajeAvance: Number(contrato.porcentajeAvance),
      estado: contrato.estado,
    };
  }
}

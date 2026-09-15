import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { LiquidacionRepositorioPort, RegistrarLiquidacionData } from '@modulos/liquidaciones/puertos/salida/LiquidacionRepositorio.port';
import { Contrato } from '@modulos/contratos/dominio/Contrato';

@Injectable()
export class LiquidacionPostgresRepositorio implements LiquidacionRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async registrarConActualizacion(data: RegistrarLiquidacionData, contratoActualizado: Contrato): Promise<string> {
    const liquidacionId = crypto.randomUUID();
    const props = contratoActualizado.toJSON();

    await this.prisma.$transaction([
      // 1. Guardar la liquidación
      this.prisma.liquidacion.create({
        data: {
          id: liquidacionId,
          contratoId: data.contratoId,
          registradoPorId: data.registradoPorId,
          valor: data.valor,
          metodoPago: data.metodoPago as any,
          comprobante: data.comprobanteUrl,
          nota: data.nota,
          fechaPago: data.fechaPago,
        },
      }),
      // 2. Actualizar el contrato con sus nuevos valores calculados en memoria
      this.prisma.contrato.update({
        where: { id: props.id },
        data: {
          totalPagado: props.totalPagado,
          saldoPendiente: props.saldoPendiente,
          porcentajeAvance: props.porcentajeAvance,
          diasEnMora: props.diasEnMora,
          estado: props.estado as any,
          fechaLiberacion: props.fechaLiberacion,
        },
      }),
    ]);

    return liquidacionId;
  }

  async listarPorContrato(contratoId: string): Promise<any[]> {
    return this.prisma.liquidacion.findMany({
      where: { contratoId },
      orderBy: { fechaPago: 'desc' },
    });
  }
}

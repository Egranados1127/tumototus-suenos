import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { ContratoRepositorioPort } from '@modulos/contratos/puertos/salida/ContratoRepositorio.port';
import { Contrato, EstadoContrato } from '@modulos/contratos/dominio/Contrato';

@Injectable()
export class ContratoPostgresRepositorio implements ContratoRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string): Promise<Contrato | null> {
    const row = await this.prisma.contrato.findUnique({ where: { id } });
    if (!row) return null;

    return Contrato.reconstituir({
      id: row.id,
      conductorId: row.conductorId,
      vehiculoPlaca: row.vehiculoPlaca,
      valorMoto: Number(row.valorMoto),
      porcentajeGanancia: Number(row.porcentajeGanancia),
      precioTotal: Number(row.precioTotal),
      plazoMeses: row.plazoMeses,
      cuotaDiaria: Number(row.cuotaDiaria),
      totalPagado: Number(row.totalPagado),
      saldoPendiente: Number(row.saldoPendiente),
      porcentajeAvance: Number(row.porcentajeAvance),
      diasEnMora: row.diasEnMora,
      estado: row.estado as EstadoContrato,
      fechaInicio: row.fechaInicio,
      fechaEstimadaLibre: row.fechaEstimadaLibre,
      fechaLiberacion: row.fechaLiberacion ?? undefined,
    });
  }

  async buscarActivoPorConductor(conductorId: string): Promise<Contrato | null> {
    const row = await this.prisma.contrato.findFirst({
      where: {
        conductorId,
        estado: { in: ['ACTIVO', 'EN_MORA', 'SUSPENDIDO'] },
      },
    });
    if (!row) return null;

    return Contrato.reconstituir({
      id: row.id,
      conductorId: row.conductorId,
      vehiculoPlaca: row.vehiculoPlaca,
      valorMoto: Number(row.valorMoto),
      porcentajeGanancia: Number(row.porcentajeGanancia),
      precioTotal: Number(row.precioTotal),
      plazoMeses: row.plazoMeses,
      cuotaDiaria: Number(row.cuotaDiaria),
      totalPagado: Number(row.totalPagado),
      saldoPendiente: Number(row.saldoPendiente),
      porcentajeAvance: Number(row.porcentajeAvance),
      diasEnMora: row.diasEnMora,
      estado: row.estado as EstadoContrato,
      fechaInicio: row.fechaInicio,
      fechaEstimadaLibre: row.fechaEstimadaLibre,
      fechaLiberacion: row.fechaLiberacion ?? undefined,
    });
  }

  async crearConTransaccion(contrato: Contrato, vehiculoPlaca: string): Promise<void> {
    const props = contrato.toJSON();

    await this.prisma.$transaction([
      this.prisma.contrato.create({
        data: {
          id: props.id,
          conductorId: props.conductorId,
          vehiculoPlaca: props.vehiculoPlaca,
          valorMoto: props.valorMoto,
          porcentajeGanancia: props.porcentajeGanancia,
          precioTotal: props.precioTotal,
          plazoMeses: props.plazoMeses,
          cuotaDiaria: props.cuotaDiaria,
          totalPagado: props.totalPagado,
          saldoPendiente: props.saldoPendiente,
          porcentajeAvance: props.porcentajeAvance,
          estado: props.estado as any,
          fechaInicio: props.fechaInicio,
          fechaEstimadaLibre: props.fechaEstimadaLibre,
        },
      }),
      this.prisma.vehiculo.update({
        where: { placa: vehiculoPlaca },
        data: { estado: 'ENTREGADA' },
      }),
    ]);
  }

  async actualizar(contrato: Contrato): Promise<void> {
    const props = contrato.toJSON();
    await this.prisma.contrato.update({
      where: { id: props.id },
      data: {
        totalPagado: props.totalPagado,
        saldoPendiente: props.saldoPendiente,
        porcentajeAvance: props.porcentajeAvance,
        diasEnMora: props.diasEnMora,
        estado: props.estado as any,
        fechaLiberacion: props.fechaLiberacion,
      },
    });
  }
}

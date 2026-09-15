import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';

export interface ResumenFinanciero {
  totalIngresos: number;
  saldoPendienteGlobal: number;
  contratosActivos: number;
  contratosEnMora: number;
  contratosLiberados: number;
}

@Injectable()
export class ObtenerResumenFinancieroUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(): Promise<ResumenFinanciero> {
    const liquidaciones = await this.prisma.liquidacion.aggregate({
      _sum: { valor: true },
    });

    const contratos = await this.prisma.contrato.groupBy({
      by: ['estado'],
      _count: { estado: true },
      _sum: { saldoPendiente: true },
    });

    let contratosActivos = 0;
    let contratosEnMora = 0;
    let contratosLiberados = 0;
    let saldoPendienteGlobal = 0;

    for (const c of contratos) {
      saldoPendienteGlobal += Number(c._sum.saldoPendiente) || 0;
      if (c.estado === 'ACTIVO') contratosActivos = c._count.estado;
      if (c.estado === 'EN_MORA') contratosEnMora = c._count.estado;
      if (c.estado === 'LIBERADO') contratosLiberados = c._count.estado;
    }

    return {
      totalIngresos: Number(liquidaciones._sum.valor) || 0,
      saldoPendienteGlobal: Number(saldoPendienteGlobal) || 0,
      contratosActivos,
      contratosEnMora,
      contratosLiberados,
    };
  }
}

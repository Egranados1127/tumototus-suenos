import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { CONTRATO_REPO } from '@modulos/contratos/composicion/tokens';
import { ContratoRepositorioPort } from '@modulos/contratos/puertos/salida/ContratoRepositorio.port';

@Injectable()
export class MotorMoraCron {
  private readonly logger = new Logger(MotorMoraCron.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CONTRATO_REPO)
    private readonly contratoRepo: ContratoRepositorioPort,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'America/Bogota' })
  async evaluarMoraDiaria() {
    this.logger.log('Iniciando evaluación de mora de contratos...');

    // Buscar contratos que estén ACTIVO o EN_MORA
    const contratosBD = await this.prisma.contrato.findMany({
      where: { estado: { in: ['ACTIVO', 'EN_MORA'] } },
    });

    const hoy = new Date();
    let marcadosEnMora = 0;

    for (const row of contratosBD) {
      // Reconstituir usando el repo (buscamos de nuevo o mapeamos)
      const contrato = await this.contratoRepo.buscarPorId(row.id);
      if (!contrato) continue;

      // Calcular días transcurridos
      const msDia = 1000 * 60 * 60 * 24;
      const diasTranscurridos = Math.floor((hoy.getTime() - contrato.toJSON().fechaInicio.getTime()) / msDia);

      // Calcular cuotas pagadas (totalPagado / cuotaDiaria)
      const cuotasPagadas = contrato.totalPagado / contrato.cuotaDiaria;

      const diasSinPago = Math.floor(diasTranscurridos - cuotasPagadas);

      // Si debe cuotas (más de 1 día de atraso o el umbral que el negocio defina)
      if (diasSinPago >= 1) {
        contrato.marcarEnMora(diasSinPago);
        await this.contratoRepo.actualizar(contrato);
        marcadosEnMora++;
        this.logger.warn(`Contrato ${contrato.id} EN MORA: debe ${diasSinPago} días.`);
      }
    }

    this.logger.log(`Evaluación finalizada. ${marcadosEnMora} contratos entraron o siguen en mora.`);
  }
}

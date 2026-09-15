import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DOCUMENTO_REPO } from '@modulos/documentos/composicion/tokens';
import { DocumentoRepositorioPort } from '@modulos/documentos/puertos/salida/DocumentoRepositorio.port';

@Injectable()
export class AlertaDocumentosCron {
  private readonly logger = new Logger(AlertaDocumentosCron.name);

  constructor(
    @Inject(DOCUMENTO_REPO)
    private readonly documentoRepo: DocumentoRepositorioPort,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'America/Bogota' })
  async evaluarVencimientos() {
    this.logger.log('Iniciando evaluación de vencimiento de documentos (30 días de umbral)...');
    
    // Obtenemos los que vencen en 30 días o menos y aún no están VENCIDO
    const documentos = await this.documentoRepo.obtenerParaAlertas(30);
    const hoy = new Date();
    
    let marcadosPorVencer = 0;
    let marcadosVencidos = 0;

    for (const doc of documentos) {
      if (doc.fechaVencimiento < hoy && doc.estado !== 'VENCIDO') {
        await this.documentoRepo.actualizarEstado(doc.id, 'VENCIDO');
        marcadosVencidos++;
        this.logger.warn(`Documento ${doc.tipo} de la placa ${doc.vehiculoPlaca} está VENCIDO.`);
      } else if (doc.fechaVencimiento >= hoy && doc.estado === 'VIGENTE') {
        await this.documentoRepo.actualizarEstado(doc.id, 'POR_VENCER');
        marcadosPorVencer++;
        this.logger.log(`Documento ${doc.tipo} de la placa ${doc.vehiculoPlaca} está POR VENCER.`);
      }
    }

    this.logger.log(`Evaluación de documentos completada. Nuevos vencidos: ${marcadosVencidos}, Nuevos por vencer: ${marcadosPorVencer}`);
  }
}

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { MINIO_SERVICE } from '@compartido/minio/tokens';
import { MinioServicePort } from '@compartido/minio/MinioService.port';
import { DOCUMENTO_REPO } from '@modulos/documentos/composicion/tokens';
import { DocumentoRepositorioPort } from '@modulos/documentos/puertos/salida/DocumentoRepositorio.port';

export interface RegistrarDocumentoCommand {
  vehiculoPlaca: string;
  tipo: string;
  fechaExpedicion: Date;
  fechaVencimiento: Date;
  archivoBuffer: Buffer;
  archivoMimeType: string;
}

@Injectable()
export class RegistrarDocumentoUseCase {
  constructor(
    @Inject(MINIO_SERVICE)
    private readonly minioService: MinioServicePort,
    @Inject(DOCUMENTO_REPO)
    private readonly documentoRepo: DocumentoRepositorioPort,
  ) {}

  async ejecutar(cmd: RegistrarDocumentoCommand): Promise<{ id: string; archivoUrl: string }> {
    if (cmd.fechaVencimiento <= cmd.fechaExpedicion) {
      throw new BadRequestException('La fecha de vencimiento debe ser posterior a la expedición');
    }

    // 1. Subir archivo a MinIO
    const ext = cmd.archivoMimeType === 'application/pdf' ? 'pdf' : 'jpg';
    const nombreArchivo = `documentos/${cmd.vehiculoPlaca}/${cmd.tipo}_${Date.now()}.${ext}`;
    
    const archivoUrl = await this.minioService.subirArchivo({
      bucket: 'documentos-flota',
      nombre: nombreArchivo,
      buffer: cmd.archivoBuffer,
      mimeType: cmd.archivoMimeType,
    });

    // 2. Determinar estado inicial (VIGENTE, POR_VENCER, VENCIDO)
    const hoy = new Date();
    let estado = 'VIGENTE';
    
    if (cmd.fechaVencimiento < hoy) {
      estado = 'VENCIDO';
    } else {
      const msDia = 1000 * 60 * 60 * 24;
      const diasRestantes = (cmd.fechaVencimiento.getTime() - hoy.getTime()) / msDia;
      if (diasRestantes <= 30) {
        estado = 'POR_VENCER';
      }
    }

    // 3. Persistir en la base de datos
    const id = await this.documentoRepo.crear({
      vehiculoPlaca: cmd.vehiculoPlaca,
      tipo: cmd.tipo,
      fechaExpedicion: cmd.fechaExpedicion,
      fechaVencimiento: cmd.fechaVencimiento,
      archivoUrl,
      estado,
    });

    return { id, archivoUrl };
  }
}

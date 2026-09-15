import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { DocumentoRepositorioPort, CrearDocumentoData } from '@modulos/documentos/puertos/salida/DocumentoRepositorio.port';

@Injectable()
export class DocumentoPostgresRepositorio implements DocumentoRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: CrearDocumentoData): Promise<string> {
    const doc = await this.prisma.documentoVehicular.create({
      data: {
        id: crypto.randomUUID(),
        vehiculoPlaca: data.vehiculoPlaca,
        tipo: data.tipo as any,
        fechaExpedicion: data.fechaExpedicion,
        fechaVencimiento: data.fechaVencimiento,
        archivoUrl: data.archivoUrl,
        estado: data.estado as any,
      },
    });
    return doc.id;
  }

  async listarPorPlaca(placa: string): Promise<any[]> {
    return this.prisma.documentoVehicular.findMany({
      where: { vehiculoPlaca: placa },
      orderBy: { fechaVencimiento: 'desc' },
    });
  }

  async obtenerParaAlertas(diasUmbral: number): Promise<any[]> {
    const umbral = new Date();
    umbral.setDate(umbral.getDate() + diasUmbral);

    return this.prisma.documentoVehicular.findMany({
      where: {
        estado: { in: ['VIGENTE', 'POR_VENCER'] },
        fechaVencimiento: { lte: umbral },
      },
    });
  }

  async actualizarEstado(id: string, estado: string): Promise<void> {
    await this.prisma.documentoVehicular.update({
      where: { id },
      data: { estado: estado as any },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { PedidoRepositorioPort } from '@modulos/marketplace/puertos/salida/PedidoRepositorio.port';

@Injectable()
export class PedidoPostgresRepositorio implements PedidoRepositorioPort {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(pedido: any): Promise<void> {
    await this.prisma.pedido.upsert({
      where: { id: pedido.id },
      update: pedido,
      create: pedido,
    });
  }

  async buscarPorId(id: string): Promise<any | null> {
    return this.prisma.pedido.findUnique({ where: { id } });
  }

  async listarDisponibles(): Promise<any[]> {
    return this.prisma.pedido.findMany({
      where: { estado: 'SOLICITADO' },
      include: { comercio: { select: { nombre: true, direccion: true, telefono: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async asignarConductorAtomico(pedidoId: string, conductorId: string): Promise<boolean> {
    const res = await this.prisma.pedido.updateMany({
      where: { id: pedidoId, estado: 'SOLICITADO' },
      data: { estado: 'ASIGNADO', conductorId },
    });
    return res.count > 0; // Si count es > 0, se asignó con éxito.
  }
}

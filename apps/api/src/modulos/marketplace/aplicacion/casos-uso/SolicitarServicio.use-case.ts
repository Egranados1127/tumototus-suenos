import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { COMERCIO_REPO, PEDIDO_REPO } from '@modulos/marketplace/composicion/tokens';
import { ComercioRepositorioPort } from '@modulos/marketplace/puertos/salida/ComercioRepositorio.port';
import { PedidoRepositorioPort } from '@modulos/marketplace/puertos/salida/PedidoRepositorio.port';

@Injectable()
export class SolicitarServicioUseCase {
  constructor(
    @Inject(COMERCIO_REPO)
    private readonly comercioRepo: ComercioRepositorioPort,
    @Inject(PEDIDO_REPO)
    private readonly pedidoRepo: PedidoRepositorioPort,
  ) {}

  async ejecutar(qrToken: string, dto: { descripcion: string; direccionEntrega: string; notas?: string }) {
    const comercio = await this.comercioRepo.buscarPorQrToken(qrToken);
    
    if (!comercio || !comercio.activo) {
      throw new NotFoundException('Comercio no encontrado o inactivo');
    }

    const pedido = {
      id: uuidv4(),
      comercioId: comercio.id,
      descripcion: dto.descripcion,
      direccionEntrega: dto.direccionEntrega,
      notas: dto.notas || null,
      estado: 'SOLICITADO',
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };

    await this.pedidoRepo.guardar(pedido);
    
    // Aquí es donde entraría un WebSocket o SSE para notificar a los conductores
    
    return pedido;
  }
}

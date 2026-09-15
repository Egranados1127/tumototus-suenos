import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PEDIDO_REPO } from '@modulos/marketplace/composicion/tokens';
import { PedidoRepositorioPort } from '@modulos/marketplace/puertos/salida/PedidoRepositorio.port';

@Injectable()
export class CompletarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPO)
    private readonly pedidoRepo: PedidoRepositorioPort,
  ) {}

  async ejecutar(id: string) {
    const pedido = await this.pedidoRepo.buscarPorId(id);
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    
    pedido.estado = 'ENTREGADO';
    await this.pedidoRepo.guardar(pedido);
    return { success: true, message: 'Pedido completado con éxito' };
  }
}

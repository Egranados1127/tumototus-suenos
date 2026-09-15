import { Injectable, Inject } from '@nestjs/common';
import { PEDIDO_REPO } from '@modulos/marketplace/composicion/tokens';
import { PedidoRepositorioPort } from '@modulos/marketplace/puertos/salida/PedidoRepositorio.port';

@Injectable()
export class ListarPedidosDisponiblesUseCase {
  constructor(
    @Inject(PEDIDO_REPO)
    private readonly pedidoRepo: PedidoRepositorioPort,
  ) {}

  async ejecutar() {
    return this.pedidoRepo.listarDisponibles();
  }
}

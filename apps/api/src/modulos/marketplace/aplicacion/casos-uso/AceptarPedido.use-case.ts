import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { PEDIDO_REPO } from '@modulos/marketplace/composicion/tokens';
import { PedidoRepositorioPort } from '@modulos/marketplace/puertos/salida/PedidoRepositorio.port';
import { PrismaService } from '@compartido/persistencia/prisma.service';

@Injectable()
export class AceptarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPO)
    private readonly pedidoRepo: PedidoRepositorioPort,
    private readonly prisma: PrismaService,
  ) {}

  async ejecutar(pedidoId: string, usuarioId: string) {
    // 2. Intentar asignar atómicamente el pedido
    // Para MVP, pasamos directamente el usuarioId como conductorId (fake ID)
    const asignado = await this.pedidoRepo.asignarConductorAtomico(pedidoId, usuarioId);
    
    if (!asignado) {
      throw new ConflictException('El pedido ya no está disponible o ya fue tomado por otro compañero.');
    }

    return { success: true, message: 'Pedido asignado con éxito.' };
  }
}

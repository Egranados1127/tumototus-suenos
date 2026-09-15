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
    let comercio = await this.comercioRepo.buscarPorQrToken(qrToken);

    // Para MVP: si no existe el comercio, lo creamos automáticamente como demo
    if (!comercio) {
      const demoComerció = {
        id: uuidv4(),
        nombre: `Comercio Demo (${qrToken})`,
        qrToken,
        activo: true,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };
      await this.comercioRepo.guardar(demoComerció);
      comercio = demoComerció;
    }

    if (!comercio.activo) {
      throw new NotFoundException('Comercio inactivo');
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

    return pedido;
  }
}

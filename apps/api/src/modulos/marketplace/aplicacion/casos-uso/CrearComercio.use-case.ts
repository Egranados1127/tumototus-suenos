import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { COMERCIO_REPO } from '@modulos/marketplace/composicion/tokens';
import { ComercioRepositorioPort } from '@modulos/marketplace/puertos/salida/ComercioRepositorio.port';

@Injectable()
export class CrearComercioUseCase {
  constructor(
    @Inject(COMERCIO_REPO)
    private readonly comercioRepo: ComercioRepositorioPort,
  ) {}

  async ejecutar(dto: { nombre: string; direccion: string; ciudad: string; telefono: string; email?: string }) {
    const comercio = {
      id: uuidv4(),
      ...dto,
      qrToken: uuidv4(), // Token único para su URL QR
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };

    await this.comercioRepo.guardar(comercio);
    return comercio;
  }
}

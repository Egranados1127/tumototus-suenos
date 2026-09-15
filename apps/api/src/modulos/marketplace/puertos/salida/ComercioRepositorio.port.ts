import { Comercio } from '@generated/prisma';

export interface ComercioRepositorioPort {
  guardar(comercio: any): Promise<void>;
  buscarPorId(id: string): Promise<any | null>;
  buscarPorQrToken(qrToken: string): Promise<any | null>;
  listarActivos(): Promise<any[]>;
}

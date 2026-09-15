import { Contrato } from '@modulos/contratos/dominio/Contrato';

export interface RegistrarLiquidacionData {
  contratoId: string;
  registradoPorId: string;
  valor: number;
  metodoPago: string;
  comprobanteUrl?: string;
  nota?: string;
  fechaPago: Date;
}

export interface LiquidacionRepositorioPort {
  registrarConActualizacion(data: RegistrarLiquidacionData, contratoActualizado: Contrato): Promise<string>;
  listarPorContrato(contratoId: string): Promise<any[]>;
}

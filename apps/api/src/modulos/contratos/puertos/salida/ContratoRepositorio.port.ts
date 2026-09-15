import { Contrato } from '../../dominio/Contrato';

export interface ContratoRepositorioPort {
  buscarPorId(id: string): Promise<Contrato | null>;
  buscarActivoPorConductor(conductorId: string): Promise<Contrato | null>;
  crearConTransaccion(contrato: Contrato, vehiculoPlaca: string): Promise<void>;
  actualizar(contrato: Contrato): Promise<void>;
}

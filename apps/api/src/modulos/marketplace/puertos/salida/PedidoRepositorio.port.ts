export interface PedidoRepositorioPort {
  guardar(pedido: any): Promise<void>;
  buscarPorId(id: string): Promise<any | null>;
  listarDisponibles(): Promise<any[]>;
  asignarConductorAtomico(pedidoId: string, conductorId: string): Promise<boolean>;
}

export interface VehiculoRepositorioPort {
  buscarPorPlaca(placa: string): Promise<{ placa: string; estado: string } | null>;
  actualizarEstado(placa: string, estado: string): Promise<void>;
  listar(): Promise<any[]>;
  crear(vehiculo: any): Promise<void>;
}

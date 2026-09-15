export interface ConductorRepositorioPort {
  buscarPorId(id: string): Promise<{ id: string; nombre: string; activo: boolean } | null>;
  tieneContratoActivo(conductorId: string): Promise<boolean>;
}

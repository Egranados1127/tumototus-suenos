export interface CrearDocumentoData {
  vehiculoPlaca: string;
  tipo: string;
  fechaExpedicion: Date;
  fechaVencimiento: Date;
  archivoUrl: string;
  estado: string;
}

export interface DocumentoRepositorioPort {
  crear(data: CrearDocumentoData): Promise<string>;
  listarPorPlaca(placa: string): Promise<any[]>;
  obtenerParaAlertas(diasUmbral: number): Promise<any[]>;
  actualizarEstado(id: string, estado: string): Promise<void>;
}

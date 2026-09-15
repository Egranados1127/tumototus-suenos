export interface SubirArchivoData {
  bucket: string;
  nombre: string;
  buffer: Buffer;
  mimeType: string;
}

export interface MinioServicePort {
  subirArchivo(data: SubirArchivoData): Promise<string>; // retorna URL pública
  eliminarArchivo(bucket: string, nombre: string): Promise<void>;
  obtenerUrlPresignada(bucket: string, nombre: string, expiresIn?: number): Promise<string>;
}

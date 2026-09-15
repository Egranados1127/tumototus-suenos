import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { MinioServicePort, SubirArchivoData } from './MinioService.port';

@Injectable()
export class MinioService implements MinioServicePort, OnModuleInit {
  private readonly minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async onModuleInit() {
    // Asegurar que los buckets existan
    const buckets = ['documentos-flota', 'comprobantes'];
    for (const b of buckets) {
      try {
        const exists = await this.minioClient.bucketExists(b);
        if (!exists) {
          await this.minioClient.makeBucket(b, 'us-east-1');
          
          // Hacer el bucket público para fácil lectura en el MVP
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${b}/*`],
              },
            ],
          };
          await this.minioClient.setBucketPolicy(b, JSON.stringify(policy));
          this.logger.log(`Bucket ${b} creado y configurado como público.`);
        }
      } catch (err) {
        this.logger.error(`Error inicializando bucket ${b}:`, err);
      }
    }
  }

  async subirArchivo(data: SubirArchivoData): Promise<string> {
    await this.minioClient.putObject(data.bucket, data.nombre, data.buffer, undefined, {
      'Content-Type': data.mimeType,
    });
    
    // Al ser público, la URL directa es:
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const host = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';
    return `${protocol}://${host}:${port}/${data.bucket}/${data.nombre}`;
  }

  async eliminarArchivo(bucket: string, nombre: string): Promise<void> {
    await this.minioClient.removeObject(bucket, nombre);
  }

  async obtenerUrlPresignada(bucket: string, nombre: string, expiresIn = 3600): Promise<string> {
    return this.minioClient.presignedGetObject(bucket, nombre, expiresIn);
  }
}

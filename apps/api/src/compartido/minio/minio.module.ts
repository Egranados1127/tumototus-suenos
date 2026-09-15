import { Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MINIO_SERVICE } from './tokens';

@Global()
@Module({
  providers: [
    { provide: MINIO_SERVICE, useClass: MinioService },
  ],
  exports: [MINIO_SERVICE],
})
export class CompartidoMinioModule {}

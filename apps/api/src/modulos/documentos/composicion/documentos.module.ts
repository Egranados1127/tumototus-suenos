import { Module } from '@nestjs/common';
import { DocumentosController } from '../adaptadores/entrada/http/documentos.controller';
import { RegistrarDocumentoUseCase } from '../aplicacion/casos-uso/RegistrarDocumento.use-case';
import { AlertaDocumentosCron } from '../aplicacion/servicios/AlertaDocumentosCron';
import { DOCUMENTO_REPO } from './tokens';
import { DocumentoPostgresRepositorio } from '../adaptadores/salida/postgres/DocumentoPostgres.repositorio';

@Module({
  controllers: [DocumentosController],
  providers: [
    RegistrarDocumentoUseCase,
    AlertaDocumentosCron,
    { provide: DOCUMENTO_REPO, useClass: DocumentoPostgresRepositorio },
  ],
})
export class DocumentosModule {}

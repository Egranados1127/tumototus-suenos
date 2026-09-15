import { Module } from '@nestjs/common';
import { IdentidadController } from '../adaptadores/entrada/http/identidad.controller';
import { IniciarSesionUseCase } from '../aplicacion/casos-uso/IniciarSesion.use-case';
import { USUARIO_REPO } from './tokens';
import { UsuarioPostgresRepositorio } from '../adaptadores/salida/postgres/UsuarioPostgres.repositorio';

@Module({
  controllers: [IdentidadController],
  providers: [
    IniciarSesionUseCase,
    { provide: USUARIO_REPO, useClass: UsuarioPostgresRepositorio },
  ],
})
export class IdentidadModule {}

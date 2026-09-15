import { Module } from '@nestjs/common';
import { PostulacionesController } from '@modulos/registro/adaptadores/entrada/http/postulaciones.controller';
import { CrearPostulacionUseCase } from '@modulos/registro/aplicacion/casos-uso/CrearPostulacion.use-case';

@Module({
  imports: [],
  controllers: [PostulacionesController],
  providers: [CrearPostulacionUseCase],
})
export class RegistroModule {}

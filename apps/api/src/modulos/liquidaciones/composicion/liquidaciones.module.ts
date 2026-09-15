import { Module } from '@nestjs/common';
import { LiquidacionesController } from '../adaptadores/entrada/http/liquidaciones.controller';
import { RegistrarLiquidacionUseCase } from '../aplicacion/casos-uso/RegistrarLiquidacion.use-case';
import { LIQUIDACION_REPO } from './tokens';
import { LiquidacionPostgresRepositorio } from '../adaptadores/salida/postgres/LiquidacionPostgres.repositorio';
import { ContratosModule } from '../../contratos/composicion/contratos.module';
import { MINIO_SERVICE } from '../../../compartido/minio/tokens';

@Module({
  imports: [ContratosModule],
  controllers: [LiquidacionesController],
  providers: [
    RegistrarLiquidacionUseCase,
    { provide: LIQUIDACION_REPO, useClass: LiquidacionPostgresRepositorio },
  ],
})
export class LiquidacionesModule {}

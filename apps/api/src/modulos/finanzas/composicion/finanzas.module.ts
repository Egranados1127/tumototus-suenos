import { Module } from '@nestjs/common';
import { FinanzasController } from '../adaptadores/entrada/http/finanzas.controller';
import { ObtenerResumenFinancieroUseCase } from '../aplicacion/casos-uso/ObtenerResumenFinanciero.use-case';

@Module({
  controllers: [FinanzasController],
  providers: [ObtenerResumenFinancieroUseCase],
})
export class FinanzasModule {}

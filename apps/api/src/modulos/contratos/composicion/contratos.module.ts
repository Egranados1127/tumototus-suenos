import { Module } from '@nestjs/common';
import { ContratosController } from '../adaptadores/entrada/http/contratos.controller';
import { CrearContratoUseCase } from '../aplicacion/casos-uso/CrearContrato.use-case';
import { SimularCuotaUseCase } from '../aplicacion/casos-uso/SimularCuota.use-case';
import { CONTRATO_REPO, CONDUCTOR_REPO, VEHICULO_REPO } from './tokens';
import { ContratoPostgresRepositorio } from '../adaptadores/salida/postgres/ContratoPostgres.repositorio';
import { ConductorPostgresRepositorio } from '../adaptadores/salida/postgres/ConductorPostgres.repositorio';
import { VehiculosModule } from '../../vehiculos/composicion/vehiculos.module';
import { VehiculosPostgresRepositorio } from '../../vehiculos/adaptadores/salida/postgres/VehiculosPostgres.repositorio';

import { MotorMoraCron } from '../aplicacion/servicios/MotorMoraCron';

import { ObtenerMiContratoUseCase } from '../aplicacion/casos-uso/ObtenerMiContrato.use-case';

@Module({
  imports: [VehiculosModule],
  controllers: [ContratosController],
  providers: [
    CrearContratoUseCase,
    SimularCuotaUseCase,
    ObtenerMiContratoUseCase,
    MotorMoraCron,
    { provide: CONTRATO_REPO, useClass: ContratoPostgresRepositorio },
    { provide: CONDUCTOR_REPO, useClass: ConductorPostgresRepositorio },
    { provide: VEHICULO_REPO, useExisting: VehiculosPostgresRepositorio },
  ],
  exports: [CONTRATO_REPO],
})
export class ContratosModule {}

// ══════════════════════════════════════════════════════════════════
// MÓDULO VEHÍCULOS — Composición DI (NestJS Module)
// Conecta repositorio → use cases → controller
// ══════════════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { VehiculosPostgresRepositorio } from '../adaptadores/salida/postgres/VehiculosPostgres.repositorio';
import { VehiculosController } from '../adaptadores/entrada/http/vehiculos.controller';

@Module({
  controllers: [VehiculosController],
  providers: [VehiculosPostgresRepositorio],
  exports: [VehiculosPostgresRepositorio],
})
export class VehiculosModule {}

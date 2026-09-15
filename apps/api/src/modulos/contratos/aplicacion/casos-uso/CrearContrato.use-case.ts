// ══════════════════════════════════════════════════════════════════
// Módulo CONTRATOS — Use Case: Crear Contrato RTO
// Calculadora financiera del corazón del negocio
// ══════════════════════════════════════════════════════════════════

import { Injectable, Inject } from '@nestjs/common';
import { CrearContratoCommand } from '@modulos/contratos/puertos/entrada/CrearContrato';
import { ContratoRepositorioPort } from '@modulos/contratos/puertos/salida/ContratoRepositorio.port';
import { VehiculoRepositorioPort } from '@modulos/contratos/puertos/salida/VehiculoRepositorio.port';
import { ConductorRepositorioPort } from '@modulos/contratos/puertos/salida/ConductorRepositorio.port';
import { Contrato } from '@modulos/contratos/dominio/Contrato';
import { CONTRATO_REPO, VEHICULO_REPO, CONDUCTOR_REPO } from '@modulos/contratos/composicion/tokens';

@Injectable()
export class CrearContratoUseCase {
  constructor(
    @Inject(CONTRATO_REPO)
    private readonly contratoRepo: ContratoRepositorioPort,
    @Inject(VEHICULO_REPO)
    private readonly vehiculoRepo: VehiculoRepositorioPort,
    @Inject(CONDUCTOR_REPO)
    private readonly conductorRepo: ConductorRepositorioPort,
  ) {}

  async ejecutar(cmd: CrearContratoCommand): Promise<{ contratoId: string; cuotaDiaria: number }> {
    // 1. Validar que el vehículo existe y está DISPONIBLE
    const vehiculo = await this.vehiculoRepo.buscarPorPlaca(cmd.vehiculoPlaca);
    if (!vehiculo) {
      throw new Error(`Vehículo ${cmd.vehiculoPlaca} no encontrado`);
    }
    if (vehiculo.estado !== 'DISPONIBLE') {
      throw new Error(`Vehículo ${cmd.vehiculoPlaca} no está disponible (estado: ${vehiculo.estado})`);
    }

    // 2. Validar que el conductor existe y no tiene contrato activo
    const conductor = await this.conductorRepo.buscarPorId(cmd.conductorId);
    if (!conductor) {
      throw new Error(`Conductor ${cmd.conductorId} no encontrado`);
    }
    const contratoActivo = await this.contratoRepo.buscarActivoPorConductor(cmd.conductorId);
    if (contratoActivo) {
      throw new Error(`El conductor ya tiene un contrato activo (${contratoActivo.id})`);
    }

    // 3. CALCULADORA FINANCIERA RTO
    // ────────────────────────────────────────────────────────────────
    //   precioTotal  = valorMoto × (1 + porcentajeGanancia / 100)
    //   cuotaDiaria  = precioTotal / (plazoMeses × 30)
    // ────────────────────────────────────────────────────────────────
    const precioTotal = cmd.valorMoto * (1 + cmd.porcentajeGanancia / 100);
    const cuotaDiaria = Math.ceil(precioTotal / (cmd.plazoMeses * 30));

    // 4. Crear la entidad de dominio (validación interna)
    const contrato = Contrato.crear({
      conductorId: cmd.conductorId,
      vehiculoPlaca: cmd.vehiculoPlaca,
      valorMoto: cmd.valorMoto,
      porcentajeGanancia: cmd.porcentajeGanancia,
      precioTotal,
      plazoMeses: cmd.plazoMeses,
      cuotaDiaria,
      fechaInicio: new Date(),
    });

    // 5. Persistir contrato + cambiar estado del vehículo (en transacción)
    await this.contratoRepo.crearConTransaccion(contrato, cmd.vehiculoPlaca);

    return {
      contratoId: contrato.id,
      cuotaDiaria,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
// Módulo CONTRATOS — Use Case: Simular Cuota RTO
// Modelo v3 — Plazos: 6, 12 y 18 meses
// Capital = Valor moto + Costos iniciales (matrícula, SOAT, GPS, seguro, casco, kit)
// Alquiler diario = cubre nuestros costos operativos + ganancia mínima $600k/mes/moto
// ══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';

// Costos iniciales que el conductor financia junto con la moto
const COSTOS_INICIALES = {
  matricula:    800_000,  // matrícula + impuesto (ciudad promedio)
  soat:         200_000,  // SOAT primer año (<125cc)
  seguro:       500_000,  // Seguro todo riesgo año 1
  gps:          300_000,  // Hardware GPS tracker
  casco:        120_000,  // Casco básico (obligatorio)
  kit:           50_000,  // Kit herramienta básica
  TOTAL:      1_970_000,
};

// Alquiler diario por plazo (cubre GPS SIM $20k + plataforma $5k + provisión $30k + ganancia ≥$600k/mes)
const ALQUILER_DIARIO: Record<number, number> = {
  6:  25_000,  // Prima de riesgo alta (plazo corto, mayor rotación)
  12: 22_000,  // Prima media
  18: 22_000,  // Prima baja (mayor compromiso, menor rotación)
};

const PLAZOS_VALIDOS = [6, 12, 18];

export interface SimulacionRTO {
  plazoMeses: number;
  capitalTotal: number;        // Valor moto + costos iniciales
  costosIniciales: number;     // $1.970.000 fijos
  cuotaDiaria: number;         // Total a cobrar al conductor
  cuotaSemanal: number;
  cuotaMensual: number;
  desglose: {
    cuotaCapitalDiaria: number;   // Abono al activo (moto + docs)
    cuotaAlquilerDiaria: number;  // Ganancia TuMotoTus Sueños
  };
  precioTotal: number;           // Total que paga el conductor
  gananciaTotal: number;         // Nuestra ganancia bruta total
  gananciaMensual: number;       // Nuestra ganancia mensual
  recomendado: boolean;          // Plan estrella
}

export interface SimularCuotaCommand {
  valorMoto: number;            // Precio de la moto COP
  plazosASimular?: number[];    // Por defecto [6, 12, 18]
}

@Injectable()
export class SimularCuotaUseCase {
  ejecutar(cmd: SimularCuotaCommand): SimulacionRTO[] {
    const plazos = (cmd.plazosASimular ?? PLAZOS_VALIDOS)
      .filter(p => PLAZOS_VALIDOS.includes(p));

    const capitalTotal = cmd.valorMoto + COSTOS_INICIALES.TOTAL;

    return plazos.map((plazoMeses) => {
      const alquilerDiario  = ALQUILER_DIARIO[plazoMeses];
      const diasTotales     = plazoMeses * 30;

      const cuotaCapitalDiaria  = Math.ceil(capitalTotal / diasTotales);
      const cuotaDiaria         = cuotaCapitalDiaria + alquilerDiario;
      const precioTotal         = cuotaDiaria * diasTotales;
      const gananciaTotal       = alquilerDiario * diasTotales;
      const gananciaMensual     = alquilerDiario * 30;

      return {
        plazoMeses,
        capitalTotal,
        costosIniciales:          COSTOS_INICIALES.TOTAL,
        cuotaDiaria,
        cuotaSemanal:             cuotaDiaria * 7,
        cuotaMensual:             cuotaDiaria * 30,
        desglose: {
          cuotaCapitalDiaria,
          cuotaAlquilerDiaria: alquilerDiario,
        },
        precioTotal,
        gananciaTotal,
        gananciaMensual,
        recomendado: plazoMeses === 18,  // Plan estrella
      };
    });
  }
}

/* ─── Ejemplo con Boxer CT 100 ($6.000.000) ──────────────────────
   capitalTotal = $7.970.000

   6 meses (180 días):
     cuotaCapital = $44.278/día | alquiler = $25.000 | TOTAL = $69.278/día
     cuotaMensual = $2.078.340 | ganancia = $4.500.000 ($750.000/mes)

   12 meses (360 días):
     cuotaCapital = $22.139/día | alquiler = $22.000 | TOTAL = $44.139/día
     cuotaMensual = $1.324.170 | ganancia = $7.920.000 ($660.000/mes)

   18 meses (540 días) ← RECOMENDADO:
     cuotaCapital = $14.760/día | alquiler = $22.000 | TOTAL = $36.760/día
     cuotaMensual = $1.102.800 | ganancia = $11.880.000 ($660.000/mes)
──────────────────────────────────────────────────────────────── */

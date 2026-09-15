// ══════════════════════════════════════════════════════════════════
// Módulo CONTRATOS — Use Case: Simular Cuota RTO
// Calculadora pública — no requiere autenticación
// El admin la usa ANTES de firmar el contrato para mostrar opciones
// ══════════════════════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';

export interface SimulacionRTO {
  plazoMeses: number;
  cuotaDiaria: number;        // Total a cobrar al conductor
  cuotaSemanal: number;
  cuotaMensual: number;
  desglose: {
    cuotaMotoDiaria: number;     // Abono a capital
    cuotaAlquilerDiaria: number; // Cubre seguro, depreciación y ganancia
  };
  precioTotal: number;
  gananciaTotal: number;
  porcentajeReal: number;
}

export interface SimularCuotaCommand {
  valorMoto: number;           // COP
  plazosASimular?: number[];   // ej: [3, 6, 12]
}

@Injectable()
export class SimularCuotaUseCase {
  ejecutar(cmd: SimularCuotaCommand): SimulacionRTO[] {
    // Escenarios exactos solicitados por gerencia: 3, 6 y 12 meses
    const plazos = cmd.plazosASimular ?? [3, 6, 12];
    
    const plazosValidos = plazos.filter(p => [3, 6, 12].includes(p));

    return plazosValidos.map((plazoMeses) => {
      // Alquiler dinámico que absorbe Seguros, Depreciación y Ganancia
      // Ecuación lineal aproximada: 12 meses = 13.300 | 6 meses = 15.100 | 3 meses = 16.000
      let alquilerDiario = 13300;
      if (plazoMeses === 3) alquilerDiario = 16000;
      if (plazoMeses === 6) alquilerDiario = 15100;
      
      const diasTotales = plazoMeses * 30;
      
      // Cuota Fija para el pago exclusivo de la moto (Capital)
      const abonoCapitalDiario = Math.ceil(cmd.valorMoto / diasTotales);
      
      // Cuota Integral que paga el conductor
      const cuotaDiaria = abonoCapitalDiario + alquilerDiario;
      
      const precioTotal = cuotaDiaria * diasTotales;
      const gananciaTotal = alquilerDiario * diasTotales;

      return {
        plazoMeses,
        cuotaDiaria,
        cuotaSemanal: cuotaDiaria * 7,
        cuotaMensual: cuotaDiaria * 30,
        desglose: {
          cuotaMotoDiaria: abonoCapitalDiario,
          cuotaAlquilerDiaria: alquilerDiario,
        },
        precioTotal,
        gananciaTotal,
        porcentajeReal: Math.round((gananciaTotal / cmd.valorMoto) * 100),
      };
    });
  }
}

/* Ejemplo de respuesta para una moto de $4.500.000 COP con 30% ganancia:

  [
    { plazoMeses: 12, cuotaDiaria: 16250, cuotaSemanal: 113750, cuotaMensual: 487500, precioTotal: 5850000, gananciaTotal: 1350000 },
    { plazoMeses: 18, cuotaDiaria: 10834, cuotaSemanal: 75838, cuotaMensual: 325020, precioTotal: 5850000, gananciaTotal: 1350000 },
    { plazoMeses: 24, cuotaDiaria: 8125, cuotaSemanal: 56875, cuotaMensual: 243750, precioTotal: 5850000, gananciaTotal: 1350000 },
  ]
*/

// ══════════════════════════════════════════════════════════════════
// MÓDULO LIQUIDACIONES — Use Case: Registrar Liquidación con Comprobante
// El conductor sube foto → MinIO → admin aprueba → saldo se actualiza
// ══════════════════════════════════════════════════════════════════

import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CONTRATO_REPO } from '@modulos/contratos/composicion/tokens';
import { LIQUIDACION_REPO } from '@modulos/liquidaciones/composicion/tokens';
import { MINIO_SERVICE } from '@compartido/minio/tokens';
import { ContratoRepositorioPort } from '@modulos/contratos/puertos/salida/ContratoRepositorio.port';
import { LiquidacionRepositorioPort } from '@modulos/liquidaciones/puertos/salida/LiquidacionRepositorio.port';
import { MinioServicePort } from '@compartido/minio/MinioService.port';

export interface RegistrarLiquidacionCommand {
  contratoId: string;
  conductorId: string;      // Para verificar que el conductor es dueño del contrato
  usuarioId: string;        // El ID del usuario autenticado
  valor: number;            // COP
  metodoPago: 'EFECTIVO' | 'NEQUI' | 'TRANSFERENCIA' | 'WOMPI';
  comprobanteBuffer?: Buffer; // Foto del comprobante (opcional si es efectivo)
  comprobanteMimeType?: string;
  nota?: string;
}

export interface ResultadoLiquidacion {
  liquidacionId: string;
  comprobanteUrl?: string;
  nuevoTotalPagado: number;
  nuevoSaldo: number;
  porcentajeAvance: number;
  estadoContrato: string;
  mensajeEstado: string;
}

@Injectable()
export class RegistrarLiquidacionUseCase {
  constructor(
    @Inject(CONTRATO_REPO)
    private readonly contratoRepo: ContratoRepositorioPort,
    @Inject(LIQUIDACION_REPO)
    private readonly liquidacionRepo: LiquidacionRepositorioPort,
    @Inject(MINIO_SERVICE)
    private readonly minioService: MinioServicePort,
  ) {}

  async ejecutar(cmd: RegistrarLiquidacionCommand): Promise<ResultadoLiquidacion> {
    // 1. Obtener y validar el contrato
    const contrato = await this.contratoRepo.buscarPorId(cmd.contratoId);
    if (!contrato) {
      throw new NotFoundException(`Contrato ${cmd.contratoId} no encontrado`);
    }

    // 2. Verificar que el conductor es el dueño del contrato (Omitido para ADMIN en MVP)
    // En un futuro: validar si cmd.usuarioId corresponde al PerfilConductor.usuarioId del contrato.
    // if (contrato.conductorId !== cmd.conductorId) {
    //   throw new BadRequestException('No tienes permiso para registrar pagos en este contrato');
    // }

    // 3. Validar estado del contrato
    if (contrato.estado === 'LIBERADO') {
      throw new BadRequestException('Este contrato ya está completamente pagado 🎉');
    }
    if (contrato.estado === 'SUSPENDIDO') {
      throw new BadRequestException('Este contrato está suspendido. Contacta al administrador.');
    }

    // 4. Subir comprobante a MinIO (si el conductor lo adjuntó)
    let comprobanteUrl: string | undefined;
    if (cmd.comprobanteBuffer && cmd.comprobanteMimeType) {
      const nombreArchivo = `comprobantes/${cmd.contratoId}/${Date.now()}.jpg`;
      comprobanteUrl = await this.minioService.subirArchivo({
        bucket: process.env.MINIO_BUCKET_DOCUMENTOS ?? 'documentos-flota',
        nombre: nombreArchivo,
        buffer: cmd.comprobanteBuffer,
        mimeType: cmd.comprobanteMimeType,
      });
    }

    // 5. Reglas de negocio puras (Dominio)
    contrato.registrarPago(cmd.valor);

    // 6. Registrar la liquidación + persistir el contrato actualizado (transacción)
    const liquidacionId = await this.liquidacionRepo.registrarConActualizacion(
      {
        contratoId: cmd.contratoId,
        registradoPorId: cmd.usuarioId, // We need to add this to cmd
        valor: cmd.valor,
        metodoPago: cmd.metodoPago,
        comprobanteUrl,
        nota: cmd.nota,
        fechaPago: new Date(),
      },
      contrato
    );

    // 6. Leer el contrato actualizado para retornar el estado real
    const contratoActualizado = await this.contratoRepo.buscarPorId(cmd.contratoId);

    // 7. Construir mensaje de estado motivacional para el conductor
    const avance = contratoActualizado!.porcentajeAvance;
    let mensajeEstado: string;
    if (contratoActualizado!.estado === 'LIBERADO') {
      mensajeEstado = '🎉 ¡Felicitaciones! La moto es tuya. Puedes recoger tus documentos.';
    } else if (avance >= 75) {
      mensajeEstado = `💪 ¡Vas muy bien! Ya llevas el ${Math.floor(avance)}% — ya casi es tuya.`;
    } else if (avance >= 50) {
      mensajeEstado = `🏁 ¡A mitad del camino! Llevas el ${Math.floor(avance)}% pagado.`;
    } else if (avance >= 25) {
      mensajeEstado = `📈 Buen ritmo. Llevas el ${Math.floor(avance)}% pagado.`;
    } else {
      mensajeEstado = `✅ Pago registrado. Llevas el ${Math.floor(avance)}% pagado.`;
    }

    return {
      liquidacionId,
      comprobanteUrl,
      nuevoTotalPagado: contratoActualizado!.totalPagado,
      nuevoSaldo: contratoActualizado!.saldoPendiente,
      porcentajeAvance: contratoActualizado!.porcentajeAvance,
      estadoContrato: contratoActualizado!.estado,
      mensajeEstado,
    };
  }
}

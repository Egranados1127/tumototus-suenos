// ══════════════════════════════════════════════════════════════════
// MÓDULO CONTRATOS — Dominio: Entidad Contrato
// Lógica de negocio pura — sin dependencias externas
// ══════════════════════════════════════════════════════════════════

export type EstadoContrato = 'ACTIVO' | 'EN_MORA' | 'SUSPENDIDO' | 'LIBERADO';

export interface ContratoProps {
  id: string;
  conductorId: string;
  vehiculoPlaca: string;
  valorMoto: number;
  porcentajeGanancia: number;
  precioTotal: number;
  plazoMeses: number;
  cuotaDiaria: number;
  totalPagado: number;
  saldoPendiente: number;
  porcentajeAvance: number;
  diasEnMora: number;
  estado: EstadoContrato;
  fechaInicio: Date;
  fechaEstimadaLibre: Date;
  fechaLiberacion?: Date;
}

export class Contrato {
  private constructor(private props: ContratoProps) {}

  // ── Factory: Crear nuevo contrato ─────────────────────────────
  static crear(params: {
    conductorId: string;
    vehiculoPlaca: string;
    valorMoto: number;
    porcentajeGanancia: number;
    precioTotal: number;
    plazoMeses: number;
    cuotaDiaria: number;
    fechaInicio: Date;
  }): Contrato {
    const fechaEstimadaLibre = new Date(params.fechaInicio);
    fechaEstimadaLibre.setMonth(fechaEstimadaLibre.getMonth() + params.plazoMeses);

    return new Contrato({
      id: crypto.randomUUID(),
      ...params,
      totalPagado: 0,
      saldoPendiente: params.precioTotal,
      porcentajeAvance: 0,
      diasEnMora: 0,
      estado: 'ACTIVO',
      fechaEstimadaLibre,
    });
  }

  // ── Factory: Reconstituir desde BD ───────────────────────────
  static reconstituir(props: ContratoProps): Contrato {
    return new Contrato(props);
  }

  // ── Getters ───────────────────────────────────────────────────
  get id() { return this.props.id; }
  get conductorId() { return this.props.conductorId; }
  get vehiculoPlaca() { return this.props.vehiculoPlaca; }
  get cuotaDiaria() { return this.props.cuotaDiaria; }
  get totalPagado() { return this.props.totalPagado; }
  get saldoPendiente() { return this.props.saldoPendiente; }
  get porcentajeAvance() { return this.props.porcentajeAvance; }
  get estado() { return this.props.estado; }
  get diasEnMora() { return this.props.diasEnMora; }
  get precioTotal() { return this.props.precioTotal; }

  // ── Comportamientos de negocio ────────────────────────────────

  /** Registra un pago y recalcula el saldo */
  registrarPago(valorPagado: number): void {
    if (this.props.estado === 'LIBERADO') {
      throw new Error('No se puede registrar pago en un contrato liberado');
    }
    if (this.props.estado === 'SUSPENDIDO') {
      throw new Error('El contrato está suspendido');
    }

    this.props.totalPagado += valorPagado;
    this.props.saldoPendiente = this.props.precioTotal - this.props.totalPagado;
    this.props.porcentajeAvance = Math.min(
      (this.props.totalPagado / this.props.precioTotal) * 100,
      100,
    );

    // Si ya está pagado al 100% → liberar
    if (this.props.saldoPendiente <= 0) {
      this.props.estado = 'LIBERADO';
      this.props.fechaLiberacion = new Date();
      this.props.saldoPendiente = 0;
      this.props.porcentajeAvance = 100;
    } else if (this.props.estado === 'EN_MORA') {
      // Un pago saca de mora (el motor de mora evalúa días reales)
      this.props.estado = 'ACTIVO';
      this.props.diasEnMora = 0;
    }
  }

  /** Marca el contrato en mora si lleva N días sin pagar */
  marcarEnMora(diasSinPago: number): void {
    if (this.props.estado === 'ACTIVO' && diasSinPago > 0) {
      this.props.estado = 'EN_MORA';
      this.props.diasEnMora = diasSinPago;
    }
  }

  /** Verifica si la moto ya puede ser entregada en propiedad */
  estaListoParaTransferencia(): boolean {
    return this.props.estado === 'LIBERADO';
  }

  /** Porcentaje de avance redondeado para mostrar en UI */
  avanceFormateado(): string {
    return `${Math.floor(this.props.porcentajeAvance)}%`;
  }

  toJSON(): ContratoProps {
    return { ...this.props };
  }
}

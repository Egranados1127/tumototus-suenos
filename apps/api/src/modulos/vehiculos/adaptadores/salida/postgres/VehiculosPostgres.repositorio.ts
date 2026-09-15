// ══════════════════════════════════════════════════════════════════
// VEHÍCULOS — Repositorio Prisma (adaptador de salida)
// Implementa VehiculoRepositorioPort usando PrismaService
// ══════════════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@compartido/persistencia/prisma.service';
import { EstadoVehiculo } from '@generated/prisma';

export interface CrearVehiculoData {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  cilindraje: number;
  color: string;
  vin?: string;
}

export interface VehiculoDto {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  cilindraje: number;
  color: string;
  estado: string;
  odometroActual: number;
  creadoEn: Date;
  contrato?: {
    id: string;
    conductorId: string;
    estado: string;
    porcentajeAvance: number;
  } | null;
}

@Injectable()
export class VehiculosPostgresRepositorio {
  private readonly logger = new Logger(VehiculosPostgresRepositorio.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Listar toda la flota con resumen de contrato activo ─────
  async listar(): Promise<VehiculoDto[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({
      orderBy: { placa: 'asc' },
      include: {
        contratos: {
          where: {
            estado: { in: ['ACTIVO', 'EN_MORA', 'SUSPENDIDO'] },
          },
          select: {
            id: true,
            conductorId: true,
            estado: true,
            totalPagado: true,
            precioTotal: true,
          },
          take: 1,
        },
      },
    });

    return vehiculos.map((v) => ({
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
      cilindraje: v.cilindraje,
      color: v.color,
      estado: v.estado,
      odometroActual: v.odometroActual,
      creadoEn: v.creadoEn,
      contrato: v.contratos[0]
        ? {
            id: v.contratos[0].id,
            conductorId: v.contratos[0].conductorId,
            estado: v.contratos[0].estado,
            porcentajeAvance:
              Number(v.contratos[0].totalPagado) /
              Number(v.contratos[0].precioTotal) *
              100,
          }
        : null,
    }));
  }

  // ─── Buscar una moto por placa ────────────────────────────────
  async buscarPorPlaca(placa: string): Promise<VehiculoDto | null> {
    const v = await this.prisma.vehiculo.findUnique({
      where: { placa: placa.toUpperCase() },
      include: {
        contratos: {
          where: { estado: { in: ['ACTIVO', 'EN_MORA', 'SUSPENDIDO'] } },
          take: 1,
        },
      },
    });
    if (!v) return null;

    return {
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
      cilindraje: v.cilindraje,
      color: v.color,
      estado: v.estado,
      odometroActual: v.odometroActual,
      creadoEn: v.creadoEn,
      contrato: v.contratos[0]
        ? {
            id: v.contratos[0].id,
            conductorId: v.contratos[0].conductorId,
            estado: v.contratos[0].estado,
            porcentajeAvance:
              (Number(v.contratos[0].totalPagado) /
                Number(v.contratos[0].precioTotal)) *
              100,
          }
        : null,
    };
  }

  // ─── Registrar moto nueva ─────────────────────────────────────
  async crear(data: CrearVehiculoData): Promise<VehiculoDto> {
    const v = await this.prisma.vehiculo.create({
      data: {
        placa: data.placa.toUpperCase(),
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
        cilindraje: data.cilindraje,
        color: data.color,
        vin: data.vin ?? null,
        estado: 'DISPONIBLE' as EstadoVehiculo,
        odometroActual: 0,
      },
    });
    this.logger.log(`Vehículo creado: ${v.placa}`);
    return { ...v, contrato: null };
  }

  // ─── Actualizar odómetro ──────────────────────────────────────
  async actualizarOdometro(placa: string, nuevoKm: number): Promise<void> {
    await this.prisma.vehiculo.update({
      where: { placa: placa.toUpperCase() },
      data: { odometroActual: nuevoKm },
    });
  }

  // ─── Cambiar estado (DISPONIBLE | EN_CONTRATO | MANTENIMIENTO | BAJA) ─
  async actualizarEstado(placa: string, estado: string): Promise<void> {
    await this.prisma.vehiculo.update({
      where: { placa: placa.toUpperCase() },
      data: { estado: estado as EstadoVehiculo },
    });
  }
}

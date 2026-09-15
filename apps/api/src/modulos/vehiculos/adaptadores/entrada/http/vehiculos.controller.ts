// ══════════════════════════════════════════════════════════════════
// VEHÍCULOS — Controller HTTP
// Gestión de la flota de motos Rodando Sueños
// ══════════════════════════════════════════════════════════════════

import {
  Controller, Get, Post, Patch, Body, Param,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';
import { VehiculosPostgresRepositorio, CrearVehiculoData } from '@modulos/vehiculos/adaptadores/salida/postgres/VehiculosPostgres.repositorio';

// ─── DTOs ────────────────────────────────────────────────────────

class CrearVehiculoDto implements CrearVehiculoData {
  @ApiProperty({ example: 'ABC123', description: 'Placa de la moto (se normaliza a mayúsculas)' })
  @IsString() placa: string;

  @ApiProperty({ example: 'Honda' }) @IsString() marca: string;
  @ApiProperty({ example: 'CB 125F' }) @IsString() modelo: string;
  @ApiProperty({ example: 2023, minimum: 2000 }) @IsNumber() @Min(2000) @Max(2099) anio: number;
  @ApiProperty({ example: 125, description: 'Cilindraje en cc' }) @IsNumber() @Min(50) cilindraje: number;
  @ApiProperty({ example: 'Rojo' }) @IsString() color: string;

  @ApiProperty({ example: '3VWFE21C04M000001', description: 'Número VIN (opcional)', required: false })
  @IsOptional() @IsString() vin?: string;
}

class ActualizarOdometroDto {
  @ApiProperty({ example: 12500, description: 'Odómetro actual en kilómetros' })
  @IsNumber() @Min(0) kilometros: number;
}

class CambiarEstadoDto {
  @ApiProperty({ enum: ['DISPONIBLE', 'EN_CONTRATO', 'MANTENIMIENTO', 'BAJA'] })
  @IsIn(['DISPONIBLE', 'EN_CONTRATO', 'MANTENIMIENTO', 'BAJA']) estado: string;
}

// ─── Controller ──────────────────────────────────────────────────

@ApiTags('vehiculos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly repo: VehiculosPostgresRepositorio) {}

  // GET /vehiculos — Listar flota completa con estado de contratos
  @Get()
  @ApiOperation({ summary: 'Listar flota de motos con estado de contratos activos' })
  listar() {
    return this.repo.listar();
  }

  // GET /vehiculos/:placa — Detalle de una moto
  @Get(':placa')
  @ApiOperation({ summary: 'Ver detalle de una moto por placa' })
  @ApiParam({ name: 'placa', example: 'ABC123' })
  detalle(@Param('placa') placa: string) {
    return this.repo.buscarPorPlaca(placa);
  }

  // POST /vehiculos — Registrar moto nueva
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar moto nueva en la flota' })
  crear(@Body() dto: CrearVehiculoDto) {
    return this.repo.crear(dto);
  }

  // PATCH /vehiculos/:placa/odometro — Actualizar km
  @Patch(':placa/odometro')
  @ApiOperation({ summary: 'Actualizar odómetro de la moto' })
  @ApiParam({ name: 'placa', example: 'ABC123' })
  actualizarOdometro(
    @Param('placa') placa: string,
    @Body() dto: ActualizarOdometroDto,
  ) {
    return this.repo.actualizarOdometro(placa, dto.kilometros);
  }

  // PATCH /vehiculos/:placa/estado — Cambiar estado
  @Patch(':placa/estado')
  @ApiOperation({ summary: 'Cambiar estado de la moto (DISPONIBLE | EN_CONTRATO | MANTENIMIENTO | BAJA)' })
  @ApiParam({ name: 'placa', example: 'ABC123' })
  cambiarEstado(
    @Param('placa') placa: string,
    @Body() dto: CambiarEstadoDto,
  ) {
    return this.repo.actualizarEstado(placa, dto.estado);
  }
}

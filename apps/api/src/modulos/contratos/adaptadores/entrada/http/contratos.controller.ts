import { Controller, Get, Post, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';
import { UsuarioActual } from '@compartido/auth/usuario-actual.decorator';
import { SimularCuotaUseCase, SimularCuotaCommand } from '@modulos/contratos/aplicacion/casos-uso/SimularCuota.use-case';
import { CrearContratoUseCase } from '@modulos/contratos/aplicacion/casos-uso/CrearContrato.use-case';
import { ObtenerMiContratoUseCase } from '@modulos/contratos/aplicacion/casos-uso/ObtenerMiContrato.use-case';
import { IsNumber, Min, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SimularCuotaDto implements SimularCuotaCommand {
  @ApiProperty({ example: 4500000, description: 'Valor de la moto en COP' })
  @IsNumber()
  @Min(1000000)
  valorMoto: number;

  // Ganancia es calculada dinámicamente según el plazo
  // porcentajeGanancia is no longer required from the client

  @ApiProperty({ example: [12, 18, 24], required: false })
  @IsOptional()
  @IsArray()
  plazosASimular?: number[];
}

class CrearContratoDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  vehiculoPlaca: string;

  @ApiProperty({ example: 'uuid-del-conductor' })
  @IsString()
  conductorId: string;

  @ApiProperty({ example: 4500000 })
  @IsNumber()
  valorMoto: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  porcentajeGanancia: number;

  @ApiProperty({ example: 18 })
  @IsNumber()
  plazoMeses: number;
}

@ApiTags('contratos')
@Controller('contratos')
export class ContratosController {
  constructor(
    private readonly simularCuota: SimularCuotaUseCase,
    private readonly crearContrato: CrearContratoUseCase,
    private readonly obtenerMiContrato: ObtenerMiContratoUseCase,
  ) {}

  @Get('mi-contrato')
  @ApiOperation({ summary: 'Obtener el contrato activo del conductor logueado' })
  async obtenerMiContratoEndpoint() {
    // Mock user for MVP
    return this.obtenerMiContrato.ejecutar('e7b1a208-8e6d-4d2b-b68a-a7b5d1348123');
  }

  @Post('simular')
  @ApiOperation({ summary: 'Simular cuota diaria/semanal/mensual para diferentes plazos' })
  @ApiResponse({ status: 200, description: 'Tabla de opciones de pago' })
  simular(@Body() dto: SimularCuotaDto) {
    return this.simularCuota.ejecutar(dto);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear contrato RTO y entregar moto al conductor' })
  @ApiResponse({ status: 201, description: 'Contrato creado — retorna ID y cuota diaria' })
  crear(@Body() dto: CrearContratoDto) {
    return this.crearContrato.ejecutar(dto);
  }
}

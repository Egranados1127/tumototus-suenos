import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';
import { ObtenerResumenFinancieroUseCase } from '@modulos/finanzas/aplicacion/casos-uso/ObtenerResumenFinanciero.use-case';

@ApiTags('finanzas')
@Controller('finanzas')
export class FinanzasController {
  constructor(private readonly resumenUseCase: ObtenerResumenFinancieroUseCase) {}

  @Get('resumen')
  @ApiOperation({ summary: 'Obtener resumen financiero para el Dashboard Administrativo' })
  async obtenerResumen() {
    return this.resumenUseCase.ejecutar();
  }
}

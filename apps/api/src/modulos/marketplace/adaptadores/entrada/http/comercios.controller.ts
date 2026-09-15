import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrearComercioUseCase } from '@modulos/marketplace/aplicacion/casos-uso/CrearComercio.use-case';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';

@ApiTags('marketplace/comercios')
@Controller('comercios')
export class ComerciosController {
  constructor(private readonly crearComercio: CrearComercioUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo comercio (Admin)' })
  async crear(@Body() dto: { nombre: string; direccion: string; ciudad: string; telefono: string; email?: string }) {
    return this.crearComercio.ejecutar(dto);
  }
}

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IniciarSesionUseCase } from '../../../aplicacion/casos-uso/IniciarSesion.use-case';
import { IniciarSesionDto } from './IniciarSesion.dto';

@ApiTags('autenticación')
@Controller('auth')
export class IdentidadController {
  constructor(private readonly iniciarSesion: IniciarSesionUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso — retorna accessToken' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(@Body() dto: IniciarSesionDto) {
    return this.iniciarSesion.ejecutar({
      email: dto.email,
      password: dto.password,
    });
  }
}

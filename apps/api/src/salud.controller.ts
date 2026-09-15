import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('sistema')
@Controller('salud')
export class SaludController {
  @Get()
  @ApiOperation({ summary: 'Health check del API' })
  verificar() {
    return {
      estado: 'ok',
      timestamp: new Date().toISOString(),
      servicio: 'TuMotoTus Sueños API',
      version: '1.0.0',
    };
  }
}

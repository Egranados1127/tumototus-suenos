import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrearPostulacionUseCase, CrearPostulacionCommand } from '@modulos/registro/aplicacion/casos-uso/CrearPostulacion.use-case';

@ApiTags('registro/postulaciones')
@Controller('postulaciones')
export class PostulacionesController {
  constructor(private readonly crearPostulacion: CrearPostulacionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva postulación de conductor' })
  async registrar(@Body() cmd: CrearPostulacionCommand) {
    try {
      const result = await this.crearPostulacion.ejecutar(cmd);
      return { success: true, data: result };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}

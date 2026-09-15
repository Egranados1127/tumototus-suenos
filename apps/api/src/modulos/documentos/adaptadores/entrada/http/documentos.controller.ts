import { Controller, Post, Get, Param, UseGuards, UseInterceptors, UploadedFile, Body, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';
import { RegistrarDocumentoUseCase } from '@modulos/documentos/aplicacion/casos-uso/RegistrarDocumento.use-case';
import { IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum TipoDocumento {
  SOAT = 'SOAT',
  TECNICOMECANICA = 'TECNICOMECANICA',
  SEGURO_TODO_RIESGO = 'SEGURO_TODO_RIESGO',
  TARJETA_PROPIEDAD = 'TARJETA_PROPIEDAD',
}

class RegistrarDocumentoDto {
  @ApiProperty({ enum: TipoDocumento })
  @IsEnum(TipoDocumento)
  tipo: TipoDocumento;

  @ApiProperty({ example: '2023-01-01' })
  @IsDateString()
  fechaExpedicion: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  fechaVencimiento: string;
}

@ApiTags('documentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehiculos/:placa/documentos')
export class DocumentosController {
  constructor(private readonly registrarDocumento: RegistrarDocumentoUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Subir un documento vehicular (SOAT, Tecno, etc.)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del documento y el archivo PDF o Imagen',
    schema: {
      type: 'object',
      properties: {
        tipo: { type: 'string', enum: ['SOAT', 'TECNICOMECANICA', 'SEGURO_TODO_RIESGO', 'TARJETA_PROPIEDAD'] },
        fechaExpedicion: { type: 'string', format: 'date' },
        fechaVencimiento: { type: 'string', format: 'date' },
        archivo: { type: 'string', format: 'binary', description: 'PDF o Imagen del documento (Max 5MB)' },
      },
      required: ['tipo', 'fechaExpedicion', 'fechaVencimiento', 'archivo'],
    },
  })
  @UseInterceptors(FileInterceptor('archivo'))
  async registrar(
    @Param('placa') placa: string,
    @Body() dto: RegistrarDocumentoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          // Aceptamos PDF y formatos de imagen comunes
          new FileTypeValidator({ fileType: /^(application\/pdf|image\/(jpeg|png|webp))$/ }),
        ],
      }),
    )
    archivo: any,
  ) {
    return this.registrarDocumento.ejecutar({
      vehiculoPlaca: placa,
      tipo: dto.tipo,
      fechaExpedicion: new Date(dto.fechaExpedicion),
      fechaVencimiento: new Date(dto.fechaVencimiento),
      archivoBuffer: archivo.buffer,
      archivoMimeType: archivo.mimetype,
    });
  }
}

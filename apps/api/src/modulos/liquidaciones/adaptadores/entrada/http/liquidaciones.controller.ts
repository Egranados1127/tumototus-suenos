import {
  Controller, Post, Get, Body, Param,
  UseGuards, UseInterceptors, UploadedFile,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';
import { UsuarioActual } from '@compartido/auth/usuario-actual.decorator';
import { RegistrarLiquidacionUseCase } from '@modulos/liquidaciones/aplicacion/casos-uso/RegistrarLiquidacion.use-case';
import { IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

enum MetodoPago { EFECTIVO = 'EFECTIVO', NEQUI = 'NEQUI', TRANSFERENCIA = 'TRANSFERENCIA', WOMPI = 'WOMPI' }

class RegistrarLiquidacionDto {
  @ApiProperty({ example: 16250, description: 'Valor pagado en COP' })
  @IsNumber() @Min(1000) valor: number;

  @ApiProperty({ enum: MetodoPago })
  @IsEnum(MetodoPago) metodoPago: MetodoPago;

  @ApiProperty({ required: false }) @IsOptional() @IsString() nota?: string;
}

@ApiTags('liquidaciones')
@Controller('contratos/:contratoId/liquidaciones')
export class LiquidacionesController {
  constructor(private readonly registrarLiquidacion: RegistrarLiquidacionUseCase) {}

  // ─── GET: Historial de pagos ──────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Ver historial de pagos de un contrato' })
  historial(@Param('contratoId') contratoId: string) {
    // TODO: ListarLiquidacionesUseCase
    return { contratoId, liquidaciones: [] };
  }

  // ─── POST: Registrar pago + subir comprobante ─────────────────
  @Post()
  @ApiOperation({ summary: 'Registrar pago diario — el conductor sube foto del comprobante' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del pago + foto del comprobante',
    schema: {
      type: 'object',
      properties: {
        valor: { type: 'number', example: 16250 },
        metodoPago: { type: 'string', enum: ['EFECTIVO', 'NEQUI', 'TRANSFERENCIA', 'WOMPI'] },
        nota: { type: 'string' },
        comprobante: { type: 'string', format: 'binary', description: 'Foto del recibo (JPEG/PNG, máx 5MB)' },
      },
      required: ['valor', 'metodoPago'],
    },
  })
  @UseInterceptors(FileInterceptor('comprobante'))
  async registrar(
    @Param('contratoId') contratoId: string,
    @Body() dto: RegistrarLiquidacionDto,
    // @UsuarioActual() usuario: { id: string; rol: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false, // No obligatorio (efectivo puede no tener comprobante)
      }),
    )
    comprobante?: any,
  ) {
    return this.registrarLiquidacion.ejecutar({
      contratoId,
      conductorId: 'e7b1a208-8e6d-4d2b-b68a-a7b5d1348123', // Mock ID para MVP
      usuarioId: 'e7b1a208-8e6d-4d2b-b68a-a7b5d1348123', // Mock ID para MVP
      valor: Number(dto.valor),
      metodoPago: dto.metodoPago,
      comprobanteBuffer: comprobante?.buffer,
      comprobanteMimeType: comprobante?.mimetype,
      nota: dto.nota,
    });
  }
}

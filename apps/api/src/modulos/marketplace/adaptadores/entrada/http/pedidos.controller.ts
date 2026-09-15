import { Controller, Post, Get, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SolicitarServicioUseCase } from '@modulos/marketplace/aplicacion/casos-uso/SolicitarServicio.use-case';
import { AceptarPedidoUseCase } from '@modulos/marketplace/aplicacion/casos-uso/AceptarPedido.use-case';
import { ListarPedidosDisponiblesUseCase } from '@modulos/marketplace/aplicacion/casos-uso/ListarPedidosDisponibles.use-case';
import { JwtAuthGuard } from '@compartido/auth/jwt-auth.guard';
import { UsuarioActual } from '@compartido/auth/usuario-actual.decorator';
import { ObtenerDetallePedidoUseCase } from '@modulos/marketplace/aplicacion/casos-uso/ObtenerDetallePedido.use-case';
import { CompletarPedidoUseCase } from '@modulos/marketplace/aplicacion/casos-uso/CompletarPedido.use-case';

@ApiTags('marketplace/pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly solicitarServicio: SolicitarServicioUseCase,
    private readonly aceptarPedido: AceptarPedidoUseCase,
    private readonly listarDisponibles: ListarPedidosDisponiblesUseCase,
    private readonly obtenerDetallePedido: ObtenerDetallePedidoUseCase,
    private readonly completarPedido: CompletarPedidoUseCase,
  ) {}

  @Post('qr/:qrToken')
  @ApiOperation({ summary: 'Solicitar un servicio desde el QR público del comercio' })
  async solicitar(
    @Param('qrToken') qrToken: string,
    @Body() dto: { descripcion: string; direccionEntrega: string; notas?: string },
  ) {
    return this.solicitarServicio.ejecutar(qrToken, dto);
  }

  @Get('disponibles')
  @ApiOperation({ summary: 'Listar pedidos disponibles (para la PWA del conductor)' })
  async listar() {
    return this.listarDisponibles.ejecutar();
  }

  @Patch(':id/aceptar')
  @ApiOperation({ summary: 'Conductor acepta un pedido (bloqueo atómico)' })
  async aceptar(@Param('id') id: string) {
    // Simulamos un UUID de conductor quemado para probar la Fase 2 MVP
    const MOCK_USUARIO_ID = 'e7b1a208-8e6d-4d2b-b68a-a7b5d1348123';
    return this.aceptarPedido.ejecutar(id, MOCK_USUARIO_ID);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un pedido en curso' })
  async obtenerDetalle(@Param('id') id: string) {
    return this.obtenerDetallePedido.ejecutar(id);
  }

  @Patch(':id/completar')
  @ApiOperation({ summary: 'Conductor finaliza el pedido' })
  async completar(@Param('id') id: string) {
    return this.completarPedido.ejecutar(id);
  }
}

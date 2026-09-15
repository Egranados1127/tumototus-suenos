import { Module } from '@nestjs/common';
import { ComerciosController } from '@modulos/marketplace/adaptadores/entrada/http/comercios.controller';
import { PedidosController } from '@modulos/marketplace/adaptadores/entrada/http/pedidos.controller';
import { CrearComercioUseCase } from '@modulos/marketplace/aplicacion/casos-uso/CrearComercio.use-case';
import { SolicitarServicioUseCase } from '@modulos/marketplace/aplicacion/casos-uso/SolicitarServicio.use-case';
import { AceptarPedidoUseCase } from '@modulos/marketplace/aplicacion/casos-uso/AceptarPedido.use-case';
import { ListarPedidosDisponiblesUseCase } from '@modulos/marketplace/aplicacion/casos-uso/ListarPedidosDisponibles.use-case';
import { ObtenerDetallePedidoUseCase } from '@modulos/marketplace/aplicacion/casos-uso/ObtenerDetallePedido.use-case';
import { CompletarPedidoUseCase } from '@modulos/marketplace/aplicacion/casos-uso/CompletarPedido.use-case';
import { ComercioPostgresRepositorio } from '@modulos/marketplace/adaptadores/salida/postgres/ComercioPostgres.repositorio';
import { PedidoPostgresRepositorio } from '@modulos/marketplace/adaptadores/salida/postgres/PedidoPostgres.repositorio';
import { COMERCIO_REPO, PEDIDO_REPO } from './tokens';
import { ChatGateway } from '../adaptadores/entrada/ws/chat.gateway';

@Module({
  controllers: [ComerciosController, PedidosController],
  providers: [
    CrearComercioUseCase,
    SolicitarServicioUseCase,
    AceptarPedidoUseCase,
    ListarPedidosDisponiblesUseCase,
    ObtenerDetallePedidoUseCase,
    CompletarPedidoUseCase,
    { provide: COMERCIO_REPO, useClass: ComercioPostgresRepositorio },
    { provide: PEDIDO_REPO, useClass: PedidoPostgresRepositorio },
    ChatGateway
  ],
})
export class MarketplaceModule {}

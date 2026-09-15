import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // En prod debería ser la URL del frontend
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Unirse a la sala secreta del pedido
  @SubscribeMessage('unirse-sala')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { pedidoId: string, rol: 'cliente' | 'conductor' }
  ) {
    client.join(payload.pedidoId);
    console.log(`[${payload.rol}] ${client.id} se unió al pedido ${payload.pedidoId}`);
    
    // Opcional: Avisar al otro que se conectó
    this.server.to(payload.pedidoId).emit('sistema', `El ${payload.rol} ha entrado al chat.`);
  }

  // Enviar mensaje
  @SubscribeMessage('enviar-mensaje')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { pedidoId: string, mensaje: string, rol: 'cliente' | 'conductor' }
  ) {
    // Retransmite a todos en la sala del pedido
    this.server.to(payload.pedidoId).emit('nuevo-mensaje', {
      rol: payload.rol,
      mensaje: payload.mensaje,
      timestamp: new Date().toISOString()
    });
  }
}

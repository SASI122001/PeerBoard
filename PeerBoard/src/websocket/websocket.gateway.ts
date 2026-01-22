import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class AppWebSocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any, client: Socket) {
    client.broadcast.emit('offer', data);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any, client: Socket) {
    client.broadcast.emit('answer', data);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: any, client: Socket) {
    client.broadcast.emit('ice-candidate', data);
  }

  @SubscribeMessage('drawing')
  handleDrawing(@MessageBody() data: any, client: Socket) {
    this.server.emit('drawing', data);
  }

  // 🔌 New handlers for room-based WebRTC signaling

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    client.to(roomId).emit('user-joined', { id: client.id });
  }

  @SubscribeMessage('send-signal')
  handleSendSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { userToSignal, signal, callerId } = data;
    this.server.to(userToSignal).emit('receive-signal', { signal, callerId });
  }

  @SubscribeMessage('return-signal')
  handleReturnSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { signal, callerId } = data;
    this.server.to(callerId).emit('signal-returned', { signal, id: client.id });
  }
}

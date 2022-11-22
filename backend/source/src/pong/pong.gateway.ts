import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { ServerEvents, ClientEvents } from './enums/enums'
import { Socket } from 'socket.io'
import { CreateLobbyDto } from './dto/create-lobby.dto/create-lobby.dto';

@WebSocketGateway()
export class PongGateway implements OnGatewayConnection {

  async handleConnection(client: any, ...args: any[]) : Promise<void> {
    
    //? Cette fonction se lancera automatiquement a la connection d'un client (socket)
    //? Cette fonction permettera d'itentifier l'utilisateur, s'il est connecter ou a le droit de jouer au jeu.
    //? De la nous pouvons verifier son token, s'il est dans la database ect...
  }

  @SubscribeMessage(ClientEvents.CreateLobby)
  onPing( client: Socket, data : CreateLobbyDto ) {
  }

}

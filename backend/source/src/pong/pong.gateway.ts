import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { ServerEvents, ClientEvents } from './enums/enums'
import { Socket } from 'socket.io'
import { CreateLobbyDto } from './dto/create-lobby.dto/create-lobby.dto';

export type AuthenticatedSocket = Socket;

@WebSocketGateway()
export class PongGateway implements OnGatewayConnection {

  async handleConnection(client: Socket, ...args: any[]) : Promise<void> {

    
    //? Cette fonction se lancera automatiquement a la connection d'un client (socket)
    //? Cette fonction permettera d'itentifier l'utilisateur, s'il est connecter ou a le droit de jouer au jeu.
    //? De la nous pouvons verifier son token, s'il est dans la database ect...


    //? Si tout c'est bien passer nous pourrons passer au restes des methodes ci-dessous
  }

  @SubscribeMessage(ClientEvents.CreateLobby)
  onPing( client: AuthenticatedSocket, data : CreateLobbyDto ) {

  }

}
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets';
import { ClientEvents } from '../shared/client/Client.Events'
import { ServerEvents } from '../shared/server/Server.Events'
import { Server, Socket } from 'socket.io'
import { LobbyCreateDto } from './LobbyCreateDto';
import { LobbyFactory } from './lobby/lobby-factory';

export type AuthenticatedSocket = Socket;

@WebSocketGateway({
    cors:{
      origin:['http://localhost:3000'],
    },  
  }
)
export class PongGateway implements OnGatewayConnection {

    async handleConnection(client: Socket, ...args: any[]) : Promise<void> {

      
      //? Cette fonction se lancera automatiquement a la connection d'un client (socket)
      //? Cette fonction permettera d'itentifier l'utilisateur, s'il est connecter ou a le droit de jouer au jeu.
      //? De la nous pouvons verifier son token, s'il est dans la database ect...


      //? Si tout c'est bien passer nous pourrons passer au restes des methodes ci-dessous
    }

    @WebSocketServer() 
    server: Server;

    constructor( private readonly lobbyManager: LobbyFactory ) 
    {
      this.lobbyManager.server = this.server;
    }
   

    //? Blind mode 
    @SubscribeMessage(ClientEvents.CreateLobby)
    onLobbyCreation( client: AuthenticatedSocket, data: LobbyCreateDto ) : void 
    {

      this.server.emit(ServerEvents.LobbyState, { 
        data: {
          message: "Lobby created !",
        }
      }
    )

    }
    //? Blind mode


    //? Ranked mode 
    @SubscribeMessage(ClientEvents.JoinMatchmaking)
    onJoinMatchmaking() : void
    {
      this.server.emit(ServerEvents.LobbyState, { 
        data: {
          message: "Matchmaking joined !",
        }
      }
    )

    }
    //? Ranked mode 


    
}
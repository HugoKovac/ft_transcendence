import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { ClientEvents } from '../shared/client/Client.Events'
import { ServerEvents } from '../shared/server/Server.Events'
import { Server, Socket } from 'socket.io'
import { LobbyCreateDto } from './lobby/LobbyCreateDto';
import { LobbyFactory } from './lobby/lobby-factory';
import { Lobby } from './lobby/lobby';
import { LobbyJoinDto } from './lobby/LobbyJoinDto';
import { json } from 'stream/consumers';

export type AuthenticatedSocket = Socket & {

  data: {
    lobby: null | Lobby;
  };

};

export type ServerPayload = {

    [ServerEvents.LobbyCall]: {
      message: 'The lobby say you Hi !';
    };

    [ServerEvents.LobbyState]: {
      message: string;
      lobbyid : string,
    };
};

@WebSocketGateway({
    cors:{
      origin:['http://localhost:3000'],
    },  
  }
)
export class PongGateway implements OnGatewayInit,OnGatewayConnection, OnGatewayDisconnect {

    constructor( private readonly lobbyManager: LobbyFactory )
    {
    }

    afterInit(server: Server) {
      
      this.lobbyManager.server = server;

    }
 

    async handleConnection( client: Socket ) : Promise<void> 
    {

      
      //? Cette fonction se lancera automatiquement a la connection d'un client (socket)
      //? Cette fonction permettera d'itentifier l'utilisateur, s'il est connecter ou a le droit de jouer au jeu.
      //? De la nous pouvons verifier son token, s'il est dans la database ect...

      //? Si tout c'est bien passer nous pourrons passer au restes des methodes ci-dessous

      
      this.lobbyManager.initializeClient(client as AuthenticatedSocket);
    }

    async handleDisconnect( client: AuthenticatedSocket ) : Promise<void> 
    {
      this.lobbyManager.terminateClient(client);
    }

    //? Blind mode 
    @SubscribeMessage(ClientEvents.CreateLobby)
    onLobbyCreation( client: AuthenticatedSocket, data: LobbyCreateDto ) : WsResponse<ServerPayload[ServerEvents.LobbyState]> 
    {
      const lobby = this.lobbyManager.generateLobby(data.skin);
      lobby.addClient(client);

      return (ServerEvents.LobbyState, {
            event: ServerEvents.LobbyState,
            data: { message: "server_createlobby", lobbyid: lobby.id }
          }
      )
    }
    

    @SubscribeMessage(ClientEvents.JoinLobby)
    onLobbyJoin( client: AuthenticatedSocket, data: LobbyJoinDto )
    {
      this.lobbyManager.joinLobby(data.lobbyId, client);
    }

    @SubscribeMessage(ClientEvents.LeaveLobby)
    onLobbyLeave( client: AuthenticatedSocket, data: LobbyJoinDto )
    {
      if ( client.data.lobby )
        client.data.lobby.removeClient(client);
    }

    //? Blind mode


    //? Ranked mode 
    // @SubscribeMessage(ClientEvents.JoinMatchmaking)
    // onJoinMatchmaking() : 
    // {
    //   return (ServerEvents.LobbyState, {
    //     event: ServerEvents.LobbyState,
    //     data: { message: "server_createlobby", lobbyid: lobby.id }
    //   }
    // )
    // }
    //? Ranked mode 

}
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { ClientEvents } from '../shared/client/Client.Events'
import { Server, Socket } from 'socket.io'
import { LobbyFactory } from './lobby/lobbyfactory';
import { LobbyJoinDto, LobbyCreateDto } from './lobby/lobbydtos';
import { AuthenticatedSocket } from './types'

@WebSocketGateway({
    cors:{
      origin:['http://localhost:3000'],
    },  
  }
)
export class PongGateway implements OnGatewayInit,OnGatewayConnection, OnGatewayDisconnect {

    constructor( private readonly lobbyManager: LobbyFactory ) {}

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
    onLobbyCreation( client: AuthenticatedSocket, data: LobbyCreateDto )
    {
      const lobby = this.lobbyManager.generateLobby(data.skin, data.Paddle1color, data.Paddle2color, data.Ballcolor, data.Netcolor);
      lobby.addClient(client);
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

    @SubscribeMessage(ClientEvents.ReadyState)
    onReadyState( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.toggleReadyState(client.id);
    }

    @SubscribeMessage(ClientEvents.GameLoop)
    onGameLoop( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      client.data.lobby.instance.gameLoop();
    }

    @SubscribeMessage(ClientEvents.PlayerLostConnection)
    onPlayerLostConnection( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      client.data.lobby.instance.PlayerLostConnection();
    }

    @SubscribeMessage(ClientEvents.PlayerRetrieveConnection)
    onPlayerRetrieveConnection( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      client.data.lobby.instance.PlayerRetrieveConnection();
    }








    //! Annoying key handler

    @SubscribeMessage(ClientEvents.Player1ArrowDownRelease)
    onPlayer1ArrowDownRelease( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player1ArrowDownRelease();
    }

    @SubscribeMessage(ClientEvents.Player1ArrowDownPress)
    onPlayer1ArrowDownPress( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player1ArrowDownPress();
    }

    @SubscribeMessage(ClientEvents.Player1ArrowUpRelease)
    onPlayer1ArrowUpRelease( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player1ArrowUpRelease();
    }

    @SubscribeMessage(ClientEvents.Player1ArrowUpPress)
    onPlayer1ArrowUpPress( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player1ArrowUpPress();
    }

    @SubscribeMessage(ClientEvents.Player2ArrowDownRelease)
    onPlayer2ArrowDownRelease( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player2ArrowDownRelease();
    }

    @SubscribeMessage(ClientEvents.Player2ArrowDownPress)
    onPlayer2ArrowDownPress( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player2ArrowDownPress();
    }

    @SubscribeMessage(ClientEvents.Player2ArrowUpRelease)
    onPlayer2ArrowUpRelease( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player2ArrowUpRelease();
    }

    @SubscribeMessage(ClientEvents.Player2ArrowUpPress)
    onPlayer2ArrowUpPress( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.Player2ArrowUpPress();
    }

    //! Annoying key handler













    
    //? Blind mode


    //? Ranked mode 
    //? Ranked mode 

}
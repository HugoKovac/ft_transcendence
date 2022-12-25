import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, WsException } from '@nestjs/websockets';
import { ClientEvents } from '../shared/client/Client.Events'
import { Server, Socket } from 'socket.io'
import { LobbyFactory } from './lobby/lobbyfactory';
import { LobbyJoinDto, LobbyCreateDto, JoinMatchmakingDto } from './lobby/lobbydtos';
import { AuthenticatedSocket, InQueuePlayer } from './types'
import { ServerEvents } from 'src/shared/server/Server.Events';
import { Matchmaking } from './lobby/matchmaking';

@WebSocketGateway({
    cors:{
      origin:['http://localhost:3000'],
    },  
  }
)
export class PongGateway implements OnGatewayInit,OnGatewayConnection, OnGatewayDisconnect {

constructor( private readonly lobbyManager: LobbyFactory, private readonly matchmaking: Matchmaking ) { setInterval( () => { this.matchmaking.SearchAndMatch() }, 1000);  }


    afterInit(server: Server) {
      
      this.lobbyManager.server = server;
      this.matchmaking.server = server;
      this.matchmaking.LobbyGenerator = this.lobbyManager;
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
      if ( this.matchmaking.MatchmakingQueue.has(client.id) )
          this.matchmaking.MatchmakingQueue.delete(client.id);
    }

    //? Blind mode
    
    @SubscribeMessage(ClientEvents.CreateLobby)
    onLobbyCreation( client: AuthenticatedSocket, data: LobbyCreateDto )
    {
      const lobby = this.lobbyManager.generateLobby(data.skin, data.Paddle1color, data.Paddle2color, data.Ballcolor, data.Netcolor, false);
      lobby.addClient(client);
      lobby.server.to(lobby.id).emit(ServerEvents.LobbyJoin, {lobbyid: lobby.id});
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
      {
        if ( client.data.lobby.MatchMakingMode == true )
          client.data.lobby.instance.finishRankedGame(client.id);
        client.data.lobby.removeClient(client);
      }
    }

    @SubscribeMessage(ClientEvents.ReadyState)
    onReadyState( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
        return ;
      if ( client.data.lobby.instance.gameEnd == false )
        client.data.lobby.instance.toggleReadyState(client.id);
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



    @SubscribeMessage(ClientEvents.JoinMatchmaking)
    onJoinMatchMaking( client : AuthenticatedSocket, data : JoinMatchmakingDto )
    {
      if ( client.data.lobby )
        throw new WsException('You are already in a lobby !');

      this.matchmaking.addClientToQueue(client, data.SkinPref);
    }

    @SubscribeMessage(ClientEvents.LeaveMatchmaking)
    onLeaveMatchMaking( client : AuthenticatedSocket )
    {
      this.matchmaking.removeClientFromQueue(client);
    }









    
    //? Blind mode


    //? Ranked mode 
    //? Ranked mode 

}
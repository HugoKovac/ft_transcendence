import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, WsException } from '@nestjs/websockets';
import { ClientEvents } from '../shared/client/Client.Events'
import { Server, Socket } from 'socket.io'
import { LobbyFactory } from './lobby/lobbyfactory';
import { LobbyJoinDto, LobbyCreateDto, JoinMatchmakingDto } from './lobby/lobbydtos';
import { AuthenticatedSocket } from './types'
import { Matchmaking } from './lobby/matchmaking';
import { PongService } from './pong.service';
import { ServerEvents } from 'src/shared/server/Server.Events';

@WebSocketGateway({
    namespace: 'game',
    cors:{
      origin:['http://localhost:3000'],
    },  
  }
)
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

constructor( private readonly lobbyManager: LobbyFactory, private readonly matchmaking: Matchmaking,
  private readonly pongservice: PongService ) 
  { 
    setInterval( () => { this.matchmaking.SearchAndMatch() }, 1000);  
  }


    afterInit(server: Server) {
      
      this.lobbyManager.server = server;
      this.lobbyManager.pongservice = this.pongservice;
      this.matchmaking.server = server;
      this.matchmaking.pongservice = this.pongservice;
      this.matchmaking.LobbyGenerator = this.lobbyManager;
    }
 

    async handleConnection( client: Socket ) : Promise<void> 
    {
      console.log(client.handshake.query)
      this.lobbyManager.initializeClient(client as AuthenticatedSocket, client.handshake.query.userID );

      const check = await this.pongservice.checkUserID(client.data.userID);
      if ( !check )
      {
        // console.log("user not found")
        this.handleDisconnect(client as AuthenticatedSocket);
        return ;
      }
      // console.log("user found");
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
      if ( !client.data.userID )
        throw new WsException(' User not found ');
      const lobby = this.lobbyManager.generateLobby(data.skin, data.Paddle1color, data.Paddle2color, data.Ballcolor, data.Netcolor, false);
      lobby.addClient(client);
      lobby.server.to(lobby.id).emit(ServerEvents.LobbyJoin, { lobbyid: lobby.id } )
    }

    @SubscribeMessage(ClientEvents.CreateEmptyLobby)
    onEmptyLobbyCreation( client: AuthenticatedSocket, data: LobbyCreateDto )
    {
      if ( !client.data.userID )
        throw new WsException(' User not found ');
      const lobby = this.lobbyManager.generateLobby(data.skin, data.Paddle1color, data.Paddle2color, data.Ballcolor, data.Netcolor, false);
      lobby.server.to(client.id).emit(ServerEvents.LobbyJoin, { lobbyid: lobby.id } )
    }

    @SubscribeMessage(ClientEvents.JoinLobby)
    onLobbyJoin( client: AuthenticatedSocket, data: LobbyJoinDto )
    {
      console.log("Before user not found")
      if ( !client.data.userID )
        throw new WsException(' User not found ');
      console.log("client joined the lobby !")
      this.lobbyManager.joinLobby(data.lobbyId, client);
    }

    @SubscribeMessage(ClientEvents.LeaveLobby)
    onLobbyLeave( client: AuthenticatedSocket, data: LobbyJoinDto )
    {
      if ( !client.data.userID )
        throw new WsException(' User not found ');
      if ( client.data.lobby )
        client.data.lobby.removeClient(client);
    }

    @SubscribeMessage(ClientEvents.ReadyState)
    onReadyState( client : AuthenticatedSocket )
    {
      if (!client.data.lobby)
      {
        console.log("Client doesnt have a lobby brooo")
        return ;
      }
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
      if ( !client.data.userID )
        throw new WsException('User not found');
      if ( client.data.lobby )
        throw new WsException('You are already in a lobby !');
      
      this.matchmaking.addClientToQueue(client, data.SkinPref);
    }

    @SubscribeMessage(ClientEvents.LeaveMatchmaking)
    onLeaveMatchMaking( client : AuthenticatedSocket )
    {
      if ( !client.data.userID )
        throw new WsException(' User not found ');
      this.matchmaking.removeClientFromQueue(client);
    }









    
    //? Blind mode


    //? Ranked mode 
    //? Ranked mode 

}
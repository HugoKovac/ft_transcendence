import { v4 } from 'uuid';
import { Server, Socket } from "socket.io";
import { AuthenticatedSocket } from '../pong.gateway';
import { ServerEvents } from 'src/shared/server/Server.Events';
import { Instance } from '../instance/Instance';

export type ServerPayload = {

    [ServerEvents.LobbyCreation]: {
      message: string;
      lobbyid: string;
      skin: string;
    };

    [ServerEvents.LobbyState]: {

      endMessage: string,
      message: string;
      skin: string;
      lobbyid : string,

      gameEnd: boolean,
      gameStart: boolean,
      PauseGame: boolean,

      scoreOne: number,
      scoreTwo: number,

      Player1id: string,
      Player2id: string,

      Player1Ready: boolean,
      Player2Ready: boolean,

      Player1Win: boolean,
      Player2Win: boolean,

      Player1x: number,
      Player1y: number,
      Player1width: number,
      Player1height: number,
      Player1color: string,
      Player1speed: number,
      Player1gravity: number,

      Player2x: number,
      Player2y: number,
      Player2width: number,
      Player2height: number,
      Player2color: string,
      Player2speed: number,
      Player2gravity: number,

      Ballx: number,
      Bally: number,
      Ballwidth: number,
      Ballheight: number,
      Ballcolor: string,
      Ballspeed: number,
      Ballgravity: number,
    };
};

export class Lobby 
{
    public readonly id: string = v4(); //? Unique lobby ID, that will be used by clients

    public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>(); //? Where client are stored

    public readonly maxClient = 2;

    public readonly instance: Instance = new Instance(this); //? The hole game logic is an instance, in a lobby

    constructor( public readonly server: Server, public readonly skin: string ) { console.log(skin)}

    public addClient( client: AuthenticatedSocket )
    {
       this.clients.set(client.id, client); //? Adding client to the lobby

       client.join(this.id);

       client.data.lobby = this; //? Client will store an address of their lobby instance
       //! By the way this is a real low level practice, suprising for a typescript tutorial...

    //    if ( this.clients.size >= this.maxClient )
    //         this.instance.triggerStart();

        console.log("ADDING CLIENT NUMBER : ");
        console.log(client.id);

        if ( this.instance.Player1Online == false )
        {
            this.instance.Player1id = client.id;
            this.instance.Player1Online = true;
        }
        else if ( this.instance.Player2Online == false )
        {
            this.instance.Player2id = client.id;
            this.instance.Player2Online = true;
        }
        else {} //! Else go to spectator mode
        
        //? Prevenir le front que le lobby a ete modifier
        
        console.log(this.id);   

        this.refreshLobby();
    }

    public removeClient( client: AuthenticatedSocket )
    {
        console.log("REMOVING CLIENT NUMBER : ");
        console.log(client.id);
        this.clients.delete(client.id);

        client.leave(this.id);

        if ( client.id == this.instance.Player1id || client.id == this.instance.Player2id )
            this.instance.finishGame("Your Opponent left the lobby");

        client.data.lobby = null;

        this.refreshLobby();
    }

    public refreshLobby()
    {
        const payload: ServerPayload[ServerEvents.LobbyState] = {

            endMessage: this.instance.endMessage,
            message: "Refreshed lobby",
            skin: "default",
            lobbyid : this.id,

            gameEnd: this.instance.gameEnd,
            gameStart: this.instance.gameStart,
            PauseGame: this.instance.PauseGame,

            scoreOne: this.instance.scoreOne,
            scoreTwo: this.instance.scoreTwo,

            Player1id: this.instance.Player1id,
            Player2id: this.instance.Player2id,

            Player1Ready: this.instance.Player1Ready,
            Player2Ready: this.instance.Player2Ready,

            Player1Win: this.instance.Player1Win,
            Player2Win: this.instance.Player2Win,

            Player1x: this.instance.Player1.x,
            Player1y: this.instance.Player1.y,
            Player1width: this.instance.Player1.width,
            Player1height: this.instance.Player1.height,
            Player1color: this.instance.Player1.color,
            Player1speed: this.instance.Player1.speed,
            Player1gravity: this.instance.Player1.gravity,

            Player2x: this.instance.Player2.x,
            Player2y: this.instance.Player2.y,
            Player2width: this.instance.Player2.width,
            Player2height: this.instance.Player1.height,
            Player2color: this.instance.Player2.color,
            Player2speed: this.instance.Player2.speed,
            Player2gravity: this.instance.Player2.gravity,

            Ballx: this.instance.Ball.x,
            Bally: this.instance.Ball.y,
            Ballwidth: this.instance.Ball.width,
            Ballheight: this.instance.Ball.height,
            Ballcolor: this.instance.Ball.color,
            Ballspeed: this.instance.Ball.speed,
            Ballgravity: this.instance.Ball.gravity,

        }
        this.spreadLobby(ServerEvents.LobbyState, payload);
    }

    public spreadLobby<T>( event: ServerEvents, payload: T )
    {
        this.server.to(this.id).emit(event, payload);
    }

}

import { v4 } from 'uuid';
import { Server, Socket } from "socket.io";
import { AuthenticatedSocket } from '../types';
import { ServerEvents } from 'src/shared/server/Server.Events';
import { Instance } from '../instance/instance';
import { CANVASHEIGHT, CANVASWIDTH, NETHEIGHT, NETWIDTH, } from "../instance/gameConstant";
import { ServerPayload } from '../types';

export class Lobby 
{
    public readonly id: string = v4(); //? Unique lobby ID, that will be used by clients

    public readonly createdAT = new Date();

    public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>(); //? Where client are stored

    public readonly instance: Instance = new Instance(this); //? The hole game logic is an instance, in a lobby

    public readonly gameloop: any;

    constructor( public readonly server: Server, public readonly skin: string, public readonly player1Color: string, public readonly player2Color: string, public readonly ballColor: string, public readonly netColor: string )
    {
        this.instance.Player1.color = player1Color;
        this.instance.Player2.color = player2Color;
        this.instance.Ball.color = ballColor;
        this.gameloop = setInterval( () => { this.instance.gameLoop(); }, 1000 / 60); //? Game Loop is executed in 60FPS
    }

    public addClient( client: AuthenticatedSocket )
    {
        this.clients.set(client.id, client); //? Adding client to the lobby

        client.join(this.id);

        client.data.lobby = this; //? Client will store an address of their lobby instance

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
        else { this.instance.numberOfSpectator += 1; } //! Else go to spectator mode
        
        this.refreshLobby();
    }

    public removeClient( client: AuthenticatedSocket )
    {
        this.clients.delete(client.id);
        client.leave(this.id);

        if ( this.instance.gameStart == true )
        {
            if ( client.id == this.instance.Player1id )
                this.instance.finishGame("Player 1 Left Lobby");
            else if ( client.id == this.instance.Player2id )
                this.instance.finishGame("Player 2 Left Lobby");
        }
        
        if ( client.id == this.instance.Player1id )
        {
            this.instance.Player1id = null;
            this.instance.Player1Online = false;
            this.instance.Player1Ready = false;
        }
        else if ( client.id == this.instance.Player2id )
        {  
            this.instance.Player2id = null;
            this.instance.Player2Online = false;
            this.instance.Player2Ready = false;
        }
        else { this.instance.numberOfSpectator -= 1; }

        client.data.lobby = null;

        this.refreshLobby();
    }

    public refreshLobby()
    {
        const payload: ServerPayload[ServerEvents.LobbyState] = {

            canvasWidth: CANVASWIDTH, 
            canvasHeight: CANVASHEIGHT,
            netWidth: NETWIDTH,
            netHeight: NETHEIGHT,

            endMessage: this.instance.endMessage,
            message: "Refreshed lobby",
            skin: this.skin,
            NetColor: this.netColor,
            lobbyid : this.id,
            numberOfSpectator: this.instance.numberOfSpectator,

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

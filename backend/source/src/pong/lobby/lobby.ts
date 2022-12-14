import { v4 } from 'uuid';
import { Server, Socket } from "socket.io";
import { AuthenticatedSocket, RankedGameData } from '../types';
import { ServerEvents } from 'src/shared/server/Server.Events';
import { Instance } from '../instance/instance';
import { CANVASHEIGHT, CANVASWIDTH, NETHEIGHT, NETWIDTH, } from "../instance/gameConstant";
import { ServerPayload } from '../types';
import { GameEndReason } from '../enums';
import { PongService } from '../pong.service';

export class Lobby 
{
    public readonly id: string = v4(); //? Unique lobby ID, that will be used by clients

    public readonly createdAT = new Date();

    public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>(); //? Where client are stored

    public readonly instance: Instance = new Instance(this); //? The hole game logic is an instance, in a lobby

    public readonly gameloop: any;

    constructor( public readonly server: Server, public readonly skin: string, public readonly player1Color: string, public readonly player2Color: string, public readonly ballColor: string, public readonly netColor: string,
                 public readonly MatchMakingMode : boolean, private pongservice : PongService )
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
            this.instance.Player1userid = client.data.userID;
            this.instance.Player1id = client.id;
            this.instance.Player1Online = true;
        }
        else if ( this.instance.Player2Online == false )
        {
            this.instance.Player2userid = client.data.userID;
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

        if ( this.MatchMakingMode == true && this.instance.gameEnd == false )
        {
            if ( client.id == this.instance.Player1id )
                this.instance.finishGame(GameEndReason.Player1LeftRanked, this.MatchMakingMode);
            else if ( client.id == this.instance.Player2id )
                this.instance.finishGame(GameEndReason.Player2LeftRanked, this.MatchMakingMode);
        }
        else if ( this.instance.gameStart == true && this.instance.gameEnd == false )
        {
            if ( client.id == this.instance.Player1id )
                this.instance.finishGame(GameEndReason.Player1Left, this.MatchMakingMode);
            else if ( client.id == this.instance.Player2id )
                this.instance.finishGame(GameEndReason.Player2Left, this.MatchMakingMode);
        }
        
        if ( client.id == this.instance.Player1id )
        {
            this.instance.Player1id = null;
            this.instance.Player1userid = null;
            this.instance.Player1Online = false;
            this.instance.Player1Ready = false;
        }
        else if ( client.id == this.instance.Player2id )
        {  
            this.instance.Player2id = null;
            this.instance.Player2userid = null;
            this.instance.Player2Online = false;
            this.instance.Player2Ready = false;
        }
        else { this.instance.numberOfSpectator -= 1; }

        client.data.lobby = null;

        this.refreshLobby();
    }

    public async saveGame( payload: RankedGameData, endReason: string )
    {
        await this.pongservice.addRankedGame(payload);
        
        if ( endReason != GameEndReason.LobbyTimedOut )
        {
            if ( payload.Player1Won == true )
            {
                await this.pongservice.incrementeUserVictory(payload.Player1ID);
                await this.pongservice.incrementeUserDefeat(payload.Player2ID);
            }
            else if ( payload.Player2Won == true )
            {
                await this.pongservice.incrementeUserVictory(payload.Player2ID);
                await this.pongservice.incrementeUserDefeat(payload.Player1ID);
            }
        }

        const check1 = await this.pongservice.checkUserID(payload.Player1ID);
        if ( !check1 )
            return ;
        const check2 = await this.pongservice.checkUserID(payload.Player2ID);
        if ( !check2 )
            return ;

        await this.pongservice.ChangeUserStatus(check1, 1, null);
        await this.pongservice.ChangeUserStatus(check2, 1, null);
        // console.log(await this.pongservice.getAllActiveGame())
        await this.pongservice.popActiveGame(this.id);
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

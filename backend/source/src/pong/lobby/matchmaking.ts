import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { ServerEvents } from 'src/shared/server/Server.Events';
import { MAXTIME_IN_QUEUE } from '../instance/gameConstant';
import { PongService } from '../pong.service';
import { AuthenticatedSocket, InQueuePlayer } from '../types'
import { LobbyFactory } from './lobbyfactory';

export class Matchmaking
{
    public server: Server;

    public pongservice: PongService;

    public readonly MatchmakingQueue: Map<string, InQueuePlayer > = new Map<string, InQueuePlayer >();

    public LobbyGenerator : LobbyFactory;

    public addClientToQueue( client : AuthenticatedSocket, SkinPref: string )
    {
        let defaultskinpref = "default";

        switch ( SkinPref )
        {
            case "default":
                defaultskinpref = "default";
                break ;
            case "SpaceGIF":
                defaultskinpref = "SpaceGIF";
                break ;
            case "BananaGIF":
                defaultskinpref = "BananaGIF";
                break ;
            case "neonsunsetoverdrive":
                defaultskinpref = "neonsunsetoverdrive";
                break ;
            case "gotham":
                defaultskinpref = "gotham";
                break ;
        }

        if ( this.MatchmakingQueue.has(client.id) )
            this.server.to(client.id).emit(ServerEvents.ServerMessage, "You are already in a queue !");
        else
        {
            this.MatchmakingQueue.set(client.id, {joined_time: Date.now(), id: client.data.userID, pref_skin: defaultskinpref, socket: client} );
            this.server.to(client.id).emit(ServerEvents.ServerMessage, "Join the queue !");
        }
    }

    public removeClientFromQueue( client: AuthenticatedSocket )
    {
        if ( this.MatchmakingQueue.has(client.id) )
        {
            this.MatchmakingQueue.delete(client.id);
            this.server.to(client.id).emit(ServerEvents.ServerMessage, "Exited queue !");
        }
        else
            this.server.to(client.id).emit(ServerEvents.ServerMessage, "You are not in a queue !");
    }

    public canMatch( Player1 : InQueuePlayer, Player2: InQueuePlayer )
    {
        if ( Player1 !== Player2 )
            return true; //! No condition for now, match the first met
        return false;
    }

    public async Match( Player1 : InQueuePlayer, Player2: InQueuePlayer )
    {
        let skin = "default";
        if ( Player1.pref_skin != Player2.pref_skin )
        {
            if ( Math.floor(Math.random() * (10 - 0 + 1) + 0 ) >= 5 ) //? Just a rand to choose which map to take
                skin = Player1.pref_skin;
            else
                skin = Player2.pref_skin;
        }
        else
            skin = Player1.pref_skin;

        const check1 = await this.pongservice.checkUserID(Player1.id);
        if ( !check1 )
            return ;
        const check2 = await this.pongservice.checkUserID(Player2.id);
        if ( !check2 )
            return ;
        
        const lobby = this.LobbyGenerator.generateLobby(skin, "#FF0000", "#001EFF", "#FFFFFF", "#FFFFFF", true); //? Special color for ranked games

        lobby.addClient(Player1.socket);
        lobby.addClient(Player2.socket);

        console.log("HEYOO ")
        console.log(Player1.id);
        console.log(Player2.id);
        console.log("HEYOO ")
        await this.pongservice.pushActiveGame(Player1.id, Player2.id, lobby.id);
        await this.pongservice.ChangeUserStatus(check1, 2, lobby.id);
        await this.pongservice.ChangeUserStatus(check2, 2, lobby.id);
    }
    
    public async SearchAndMatch()
    {
        if ( this.MatchmakingQueue.size <= 1 )
            return ;
        for ( const [p1, p1data] of this.MatchmakingQueue )
        {
            for ( const [p2, p2data] of this.MatchmakingQueue )
            {
                if ( this.canMatch(p1data, p2data) )
                {
                    const matched1 = this.MatchmakingQueue.get(p1);
                    const matched2 = this.MatchmakingQueue.get(p2);
                    if ( matched1 && matched2 )
                    {
                        await this.Match(matched1, matched2);
                        this.MatchmakingQueue.delete(p1);
                        this.MatchmakingQueue.delete(p2);
                    }
                }
                else
                {
                    const noMatch = this.MatchmakingQueue.get(p2);
                    if ( noMatch && Date.now() - noMatch.joined_time > MAXTIME_IN_QUEUE )
                    {
                        this.server.to(noMatch.id).emit(ServerEvents.ServerMessage, "Max queue time limit exceeded , exited lobby ");
                        this.MatchmakingQueue.delete(p2);
                    }
                }
            }
        }
    }
}
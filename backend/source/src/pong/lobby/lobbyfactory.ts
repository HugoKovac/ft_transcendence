import { Server } from "socket.io";
import { AuthenticatedSocket, InQueuePlayer } from "../types";
import { Lobby } from "./lobby";
import { Cron } from '@nestjs/schedule';
import { LOBBYLIFETIME } from "../instance/gameConstant";
import { WsException } from "@nestjs/websockets";
import { ServerEvents } from "src/shared/server/Server.Events";
import { GameEndReason } from "../enums";
import { PongService } from "../pong.service";

export class LobbyFactory {

    public server: Server;

    public pongservice: PongService;

    constructor() {}

    private readonly lobbies: Map<Lobby['id'], Lobby > = new Map<Lobby['id'], Lobby >();

    public async initializeClient( client: AuthenticatedSocket , userID : string | string[] )
    {
        client.data.lobby = null;
        client.data.userID = userID as string;
    }

    public terminateClient( client: AuthenticatedSocket )
    {
        if ( client.data.lobby )
            client.data.lobby.removeClient(client);
        if ( client.data.userID )
            client.data.userID = null;
    }

    //? Generate a new lobby and insert the client that created it
    public generateLobby( skin: string, player1Color: string, player2Color: string, ballColor: string, netColor: string, MatchMakingMode: boolean ) : Lobby 
    {
        let defaultskin = "default";

        switch ( skin )
        {
            case "default":
                defaultskin = "default";
                break ;
            case "SpaceGIF":
                defaultskin = "SpaceGIF";
                break ;
            case "BananaGIF":
                defaultskin = "BananaGIF";
                break ;
            case "neonsunsetoverdrive":
                defaultskin = "neonsunsetoverdrive";
                break ;
            case "gotham":
                defaultskin = "gotham";
                break ;
        }

        const lobby = new Lobby(this.server, defaultskin, player1Color, player2Color, ballColor, netColor, MatchMakingMode, this.pongservice);
        this.lobbies.set(lobby.id, lobby);
        return lobby;
    }


    //? Otherwise if the client doesn't create a lobby he will join one
    public joinLobby( lobbyId: string, client: AuthenticatedSocket )
    {
        const lobby = this.lobbies.get(lobbyId);

        if (!lobby) //! Handle this errors
            throw new WsException('This Lobby doesnt exist !')

        lobby.addClient(client);
        lobby.server.to(lobby.id).emit(ServerEvents.LobbyJoin, {lobbyid: lobby.id});
    }

    @Cron('*/5 * * * *') //? Execute this method every 5 minutes (pretty cool)
    private LobbyClearer()
    {
        for ( const [lobbyId, lobby] of this.lobbies )
        {
            const startClock = (new Date()).getTime();
            const lobbyLifeTimer = startClock - lobby.createdAT.getTime();

            if ( lobbyLifeTimer > LOBBYLIFETIME )
            {
                lobby.instance.finishGame(GameEndReason.LobbyTimedOut, false);
                lobby.refreshLobby();
                this.lobbies.delete(lobby.id);
            }
        }    
    }

}

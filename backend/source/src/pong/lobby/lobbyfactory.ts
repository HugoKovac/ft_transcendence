import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types";
import { Lobby } from "./lobby";
import { Cron } from '@nestjs/schedule';
import { LOBBYLIFETIME } from "../instance/gameConstant";
import { WsException } from "@nestjs/websockets";

export class LobbyFactory {

    public server: Server;

    private readonly lobbies: Map<Lobby['id'], Lobby > = new Map<Lobby['id'], Lobby >();

    public initializeClient( client: AuthenticatedSocket )
    {
        client.data.lobby = null;
    }

    public terminateClient( client: AuthenticatedSocket )
    {
        if ( client.data.lobby )
            client.data.lobby.removeClient(client);
    }

    //? Generate a new lobby and insert the client that created it
    public generateLobby( skin: string ) : Lobby 
    {
        let defaultskin = "default";


        const lobby = new Lobby(this.server, skin);

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
                lobby.instance.finishGame("Lobby Timed Out.");
                lobby.refreshLobby();
                this.lobbies.delete(lobby.id);
            }
        }    
    }

}

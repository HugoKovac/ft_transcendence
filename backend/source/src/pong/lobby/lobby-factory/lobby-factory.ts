import { Server } from "http";
import { AuthenticatedSocket } from "src/pong/pong.gateway";



export class LobbyFactory {

    public server: Server;

    private readonly allLobby: Map<string, Lobby > = new Map<string, Lobby >();

    public initializeClient( client: AuthenticatedSocket ) : void {

    }

    public terminateClient( client: AuthenticatedSocket ) : void {

    }

    //? Generate a new lobby and insert the client that created it
    public generateLobby( skin: string ) : Lobby {

    }


    //? Otherwise if the client doesn't create a lobby he will join one
    public joinLobby( lobbyId: string, client: AuthenticatedSocket ) : void {

    }

    @Cron('*/5 * * * *') //? Execute this method every 5 minutes (pretty cool)
    private memclean(): void {
        
    }

}

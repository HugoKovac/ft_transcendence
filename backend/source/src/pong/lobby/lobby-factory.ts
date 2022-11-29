import { Server } from "socket.io";
import { AuthenticatedSocket } from "src/pong/pong.gateway";
import { Lobby } from "./lobby";



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
        skin = 'default'; //? Skin is set to default for now

        const lobby = new Lobby(this.server, skin);

        this.lobbies.set(lobby.id, lobby);

        return lobby;
    }


    //? Otherwise if the client doesn't create a lobby he will join one
    public joinLobby( lobbyId: string, client: AuthenticatedSocket )
    {
        if (!this.lobbies[lobbyId]) //! Handle this errors
            console.log("Lobby don't exist abort"); 

        else if ( this.lobbies[lobbyId].clients.size >= 2 ) //! Handle this errors
            console.log("Lobby is full gtf bro "); 

        this.lobbies[lobbyId].addClient(client);
    }

    // @Cron('*/5 * * * *') //? Execute this method every 5 minutes (pretty cool)
    // private memclean(): void {
        
    // }

}

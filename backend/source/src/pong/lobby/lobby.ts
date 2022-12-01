import { v4 } from 'uuid';
import { Server, Socket } from "socket.io";
import { AuthenticatedSocket, ServerPayload } from '../pong.gateway';
import { ServerEvents } from 'src/shared/server/Server.Events';
import { Instance } from '../instance/instance';


export class Lobby 
{
    public readonly id: string = v4(); //? Unique lobby ID, that will be used by clients

    public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>(); //? Where client are stored

    public readonly maxClient = 2;

    public readonly instance: Instance = new Instance(); //? The hole game logic is an instance, in a lobby

    constructor( public readonly server: Server, public readonly skin: string ) { }

    public addClient( client: AuthenticatedSocket )
    {
       this.clients.set(client.id, client); //? Adding client to the lobby

       client.join(this.id);

       client.data.lobby = this; //? Client will store an address of their lobby instance
       //! By the way this is a real low level practice, suprising for a typescript tutorial...

       if ( this.clients.size >= this.maxClient )
        console.log("Game start !");

    }

    public removeClient( client: AuthenticatedSocket )
    {
        this.clients.delete(client.id);

        client.leave(this.id);

        client.data.lobby = null;


        this.spreadLobby<ServerPayload[ServerEvents.LobbyCall]>(ServerEvents.LobbyCall, { 
            message: 'The lobby say you Hi !', 
        } );

    }

    public spreadLobby<T>( event: ServerEvents, payload: T )
    {
        this.server.to(this.id).emit(event, payload);
    }

}

import { v4 } from 'uuid';
import { Server, Socket } from "socket.io";
import { AuthenticatedSocket } from '../pong.gateway';


export class Lobby 
{
    public readonly id: string = v4(); //? Unique lobby ID, that will be used by clients

    public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>(); //? Where client are stored

    // public readonly instance: Instance = new Instance(); //? The hole game logic is an instance, in a lobby


    constructor( public readonly server: Server, public readonly skin: string ) { }

    public addClient( client: AuthenticatedSocket )
    {
       this.clients.set(client.id, client); //? Adding client to the lobby

       client.join(this.id);

       client.data.lobby = this; //? Client will store an address of their lobby instance



    }

    public removeClient( client: AuthenticatedSocket )
    {
        this.clients.delete(client.id);

        client.leave(this.id);

        client.data.lobby = null;
    }

    public sendAlert()
    {

    }

}

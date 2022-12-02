import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ServerEvents } from '../../shared/server/Server.Events'
import { ClientEvents } from '../../shared/client/Client.Events'
import NavBar from '../NavBar';
import GameInstance from './GameInstance';
import { WebsocketContext } from './WebsocketContext';

export default function GameLobby() {

    const socket = useContext(WebsocketContext);
    
    useEffect( () => {
        
    });

    const emitLobby = () => {
        socket.emit(ClientEvents.CreateLobby, {
              skin: "default",
        });
    }

    return (
        <div>
            <NavBar />
            <h4>Create or join a lobby !</h4>
            <button className="btn" onClick={() => emitLobby()}>Create Lobby</button>
        </div>
    );

}


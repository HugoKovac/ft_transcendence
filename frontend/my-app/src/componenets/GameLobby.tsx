import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ServerEvents } from '../shared/server/Server.Events'
import { ClientEvents } from '../shared/client/Client.Events'
import NavBar from './NavBar';


export default function GameLobby() {

    const socket = io('http://localhost:3000');
    
    useEffect( () => {

        socket.on('connect', () => {   
            console.log('Connected !'); 
        });

        socket.on(ServerEvents.LobbyState, (data) => {
            console.log(data);
        });

        return () => {
            console.log('Disconnected');
            socket.off('connect');
            socket.off(ServerEvents.LobbyState);
        }
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
            <button onClick={emitLobby}> Create Lobby </button>
        </div>
    );

}
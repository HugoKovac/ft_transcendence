import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ServerEvents } from '../shared/server/Server.Events'
import { ClientEvents } from '../shared/client/Client.Events'

const GameLobby = () => {

    const socket = io('http://localhost:3000');
    
    useEffect( () => {

        socket.on('connect', () => {
            console.log('Connected !'); 
        });

        socket.on(ServerEvents.LobbyState, (data) => {
            console.log('received ta mere');
            console.log(data);
        });

        return () => {
            console.log('Disconnected');
            socket.off('connect');
            socket.off(ServerEvents.LobbyState);
        }
    });

    return (
        <div>
            <h1> Game under developpement </h1>

            <h2> Try creating a lobby under here !</h2>

            <button onClick={ () => socket.emit(ClientEvents.CreateLobby)}> Create Lobby </button>
        </div>

    );
}

export default GameLobby
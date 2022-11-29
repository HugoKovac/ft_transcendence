import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ServerEvents } from '../shared/server/Server.Events'
import { ClientEvents } from '../shared/client/Client.Events'
import NavBar from './NavBar';


export default function GameMatchmaking() {

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

    const emitMatchmaking = () => {
        socket.emit(ClientEvents.JoinMatchmaking);
    }
    
    return (

        <div>
            <NavBar />
            <h4>Join Matchmaking !</h4>
            <button onClick={emitMatchmaking}> Join Matchmaking </button>

        </div>

    );

}
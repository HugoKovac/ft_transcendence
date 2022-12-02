import GameInstance from "./GameInstance";
import GameLobby from "./GameLobby";
import { useContext, useEffect, useState } from 'react';
import { ServerEvents } from '../../shared/server/Server.Events'
import { WebsocketContext } from "./WebsocketContext";
import { LobbyState } from "./LobbyState";
    
export default function GamePrivateManager() {

    const socket = useContext(WebsocketContext);
    // const [lobby, setLobby] = useRecoilState(LobbyState);

    useEffect( () => {

        socket.on('connect', () => {   
            console.log('Connected !'); 
        });

        socket.on(ServerEvents.LobbyState, (data) => {

            // setLobby(data);

            console.log(data.message);
            console.log(data.lobbyid);

        });

        return () => {

            console.log('Disconnected');    
            socket.off('connect');
            socket.off(ServerEvents.LobbyState);

        }
    });

    // if ( lobby === null )
        return <GameLobby/>

    console.log("GOING TO GAME !");
    return <GameInstance/>;
}
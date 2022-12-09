import GameInstance from "./GameInstance";
import GameLobby from "./GameLobby";
import { useContext, useEffect } from 'react';
import { ServerEvents } from '../../shared/server/Server.Events'
import { WebsocketContext } from "./WebsocketContext";
import { LobbyState } from "./LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
    
export default function GamePrivateManager() {

    const socket = useContext(WebsocketContext);
    const [lobby, setLobby] = useRecoilState(LobbyState);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect( () => {

        socket.on('connect', () => {    
            console.log('Connected !'); 
        });

        socket.on(ServerEvents.LobbyState, (data) => {
    
            setLobby(data);
            setSearchParams({id: data.lobbyid});

        });

        return () => {
            console.log('Disconnected');        
            socket.off('connect');
            socket.off(ServerEvents.LobbyState);
        }
    }, []);

    if ( lobby === null )
        return <GameLobby/>

    console.log("GOING TO GAME !");

    return <GameInstance/>;
}
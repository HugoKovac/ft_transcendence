import GameInstance from "./GameInstance";
import GameLobby from "./GameLobby";
import { useContext, useEffect } from 'react';
import { ServerEvents } from '../../shared/server/Server.Events'
import { WebsocketContext } from "./WebsocketContext";
import { LobbyState } from "./LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ClientEvents } from "../../shared/client/Client.Events";
    
export default function GamePrivateManager() {

    const socket = useContext(WebsocketContext);
    const [lobby, setLobby] = useRecoilState(LobbyState);
    const [searchParams, setSearchParams] = useSearchParams();

    let connectionLost = false;

    useEffect( () => {

        socket.on('connect', () => {

            if ( connectionLost === true )
                socket.emit(ClientEvents.PlayerRetrieveConnection);
        });

        socket.on('disconnect', (reason : Socket.DisconnectReason) => {

            if ( reason === "ping timeout" || reason === "transport close" || reason === "transport error" )
            {
                connectionLost = true;
                socket.emit(ClientEvents.PlayerLostConnection);
            }
            else
                socket.emit(ClientEvents.LeaveLobby);

        });

        socket.on(ServerEvents.LobbyState, (data) => {
            setLobby(data);
            setSearchParams({id: data.lobbyid});
        });

        return () => {
            console.log('Disconnected');        
            socket.off('connect');
            socket.off('disconnect');
            socket.off(ServerEvents.LobbyState);
        }
    }, [searchParams, setLobby, socket, setSearchParams]);

    if ( lobby === null )
        return <GameLobby/>

    return <GameInstance/>;
}
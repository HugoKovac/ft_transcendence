import GameInstance from "./GameInstance";
import GameLobby from "./GameLobby";
import { useContext, useEffect, useState } from 'react';
import { ServerEvents } from '../../../shared/server/Server.Events'
import { WebsocketContext } from "../WebsocketContext";
import { LobbyState } from "../LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ClientEvents } from "../../../shared/client/Client.Events";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    
export default function GamePrivateManager() 
{
    const socket = useContext(WebsocketContext);

    const [lobby, setLobby] = useRecoilState(LobbyState);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect( () => {

        socket.on('connect', () => 
        {
        });

        socket.on('disconnect', (reason : Socket.DisconnectReason) => 
        {
            socket.emit(ClientEvents.LeaveLobby);
        });
        
        socket.on('exception', (data) => 
        {
            console.log(data.message);
            toast(data.message);
        });

        socket.on(ServerEvents.LobbyID, (data) =>
        {
            setSearchParams({id: data.lobbyid});
            console.log(data.lobbyid);
        });

        socket.on(ServerEvents.LobbyState, (data) => 
        {
            setLobby(data);
        });

        return () => 
        {
            socket.off('connect');
            socket.off('disconnect');
            socket.off(ServerEvents.LobbyState);
            socket.off(ServerEvents.LobbyID);
        }

    }, [searchParams, setLobby, socket, setSearchParams]);

    if ( lobby === null )
        return <GameLobby/>

    return <GameInstance/>;
}
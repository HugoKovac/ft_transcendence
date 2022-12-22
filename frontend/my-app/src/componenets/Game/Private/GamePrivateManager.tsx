import GameInstance from "./GameInstance";
import GameLobby from "./GameLobby";
import { useContext, useEffect } from 'react';
import { ServerEvents } from '../../../shared/server/Server.Events'
import { WebsocketContext } from "../WebsocketContext";
import { LobbyState } from "../LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ClientEvents } from "../../../shared/client/Client.Events";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    
export default function GamePrivateManager() 
{
    const socket = useContext(WebsocketContext);

    const [lobby, setLobby] = useRecoilState(LobbyState);

    const [searchParams, setSearchParams] = useSearchParams();

    const searchParamsString = searchParams.get('id');

    useEffect( () => {

        socket.on('connect', () => {});

        socket.on('disconnect', (reason : Socket.DisconnectReason) => { socket.emit(ClientEvents.LeaveLobby); });
        
        socket.on('exception', (data) => { toast(data.message); });

        socket.on(ServerEvents.LobbyState, (data) => 
        {
            setLobby(data);
            if ( !searchParams.toString() )
                setSearchParams({id: data.lobbyid});
        });

        socket.on(ServerEvents.LobbyClear, () => {});

       

        return () => 
        {
            socket.off('connect');
            socket.off('disconnect');
            socket.off(ServerEvents.LobbyState);
        }

    }, [searchParams, setLobby, socket, setSearchParams]);

    if ( lobby === null )
        return <GameLobby/>
    
    return <GameInstance/>;
}
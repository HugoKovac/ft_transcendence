import GameInstanceRanked from "./GameInstanceRanked";
import GameMatcher from "./GameMatcher";
import { useContext, useEffect } from 'react';
import { ServerEvents } from '../../../shared/server/Server.Events'
import { WebsocketContext } from "../WebsocketContext";
import { LobbyState } from "../LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ClientEvents } from "../../../shared/client/Client.Events";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GamePrivateManager() 
{
    const socket = useContext(WebsocketContext);

    const [lobby, setLobby] = useRecoilState(LobbyState);

    const [searchParams, setSearchParams] = useSearchParams();


    useEffect( () => {

        socket.on('connect', () => {});

        socket.on('disconnect', (reason : Socket.DisconnectReason) => { socket.emit(ClientEvents.LeaveLobby); });
        
        socket.on('exception', (data) => { toast(data.message); });

        socket.on(ServerEvents.ServerMessage, (message) => { console.log("TICK"); toast(message); });

        socket.on(ServerEvents.LobbyState, (data) => { console.log("server tick"); setLobby(data); });

        socket.on(ServerEvents.LobbyJoin, (data) => { if ( !searchParams.toString() ) setSearchParams({id: data.lobbyid}); });

        return () => 
        {
            socket.off('connect');
            socket.off('disconnect');
            socket.off(ServerEvents.LobbyState);
            socket.off(ServerEvents.LobbyJoin);
            socket.off(ServerEvents.ServerMessage);
        }

    }, [searchParams, lobby]);

    if ( lobby === null )
    {
        console.log("GameMatcher")
        return (
            <div>
                <GameMatcher/>
                <ToastContainer />
            </div>
        );
    }
    console.log("GameInstanceRanked")
    return <GameInstanceRanked/>;
}
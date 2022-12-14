import GameInstanceRanked from "./GameInstanceRanked";
import GameMatcher from "./GameMatcher";
import { useContext, useEffect } from 'react';
import { ServerEvents } from '../../../shared/server/Server.Events'
import { WebsocketContext } from "../WebsocketContext";
import { LobbyState } from "../LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GamePrivateManager() 
{
    const socket = useContext(WebsocketContext);

    const [lobby, setLobby] = useRecoilState(LobbyState);

    const [searchParams, setSearchParams] = useSearchParams();


    useEffect( () => {

        if ( socket )
        {
            socket.on('connect', () => {});

            socket.on('disconnect', (reason : Socket.DisconnectReason) => { });
            
            socket.on('exception', (data) => { toast(data.message); });

            socket.on(ServerEvents.ServerMessage, (message) => { toast(message); });

            socket.on(ServerEvents.LobbyState, (data) => { setLobby(data); });
        }

        return () => 
        {
            if ( socket )
            {
                socket.off('connect');
                socket.off('disconnect');
                socket.off(ServerEvents.LobbyState);
                socket.off(ServerEvents.LobbyJoin);
                socket.off(ServerEvents.ServerMessage);
            }
        }

    }, [searchParams, lobby]);

    if ( lobby === null )
    {
        return (
            <div>
                <GameMatcher/>
                <ToastContainer />
            </div>
        );
    }
    return <GameInstanceRanked/>;
}
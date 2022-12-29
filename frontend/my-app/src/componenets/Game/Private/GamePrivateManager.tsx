import GameInstance from "./GameInstance";
import GameLobby from "./GameLobby";
import { useContext, useEffect } from 'react';
import { ServerEvents } from '../../../shared/server/Server.Events'
import { WebsocketContext } from "../WebsocketContext";
import { LobbyState } from "../LobbyState";
import { useRecoilState } from 'recoil';
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
    
export default function GamePrivateManager() 
{
    const socket = useContext(WebsocketContext);

    const [lobby, setLobby] = useRecoilState(LobbyState);

    const [searchParams, setSearchParams] = useSearchParams();

    const searchParamsString = searchParams.get('id');

    useEffect( () => {

        if ( socket )
        {
            socket.on('connect', () => {});

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

    }, [searchParams, setLobby, socket, setSearchParams]);

    if ( lobby === null )
    {
        console.log("going to lobby")
        return <GameLobby/>
    }
    
    console.log("Instance")
    return <GameInstance/>;
}
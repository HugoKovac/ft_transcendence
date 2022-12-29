import React from "react";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ClientEvents } from "../../../shared/client/Client.Events";
import NavBar from "../../NavBar";
import { WebsocketContext } from "../WebsocketContext";

export default function GameMatcher()
{
    const socket = useContext(WebsocketContext);

    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.get('id');
    
    const SkinPref = React.useRef<string>("default");

    useEffect( () => {
        
        document.getElementById('skin')?.addEventListener('change', RetrieveSkin);
        if ( searchParamsString )
        {
            if  ( socket )
            {
                socket.emit(ClientEvents.JoinLobby, 
                {
                    lobbyId: searchParamsString,
                });
            }
        }
    }, [])

    const emitJoinQueue = ( () => { console.log("Event Emitted"); if ( socket ) socket.emit(ClientEvents.JoinMatchmaking, { SkinPref: SkinPref.current }); });

    const emitLeaveQueue = ( () => { console.log("Event Emitted"); if ( socket ) socket.emit(ClientEvents.LeaveMatchmaking); });

    function RetrieveSkin( event : any )
    {
        if ( event.target.value )
            SkinPref.current = event.target.value;
    }

    return (
        <div>
            <NavBar />
            <div className="MatchmakingBtn">
                <button onClick={() => emitJoinQueue()}> Join Queue </button>
                <button onClick={() => emitLeaveQueue()}> Leave queue </button>
            </div>
            <div className="SkinSelector">
                    <select id="skin" className="SkinList">
                            <option value="default">Default</option>
                            <option value="SpaceGIF">SpaceGIF</option>
                            <option value="BananaGIF">BananaGIF</option>
                            <option value="neonsunsetoverdrive">Neon Sunset Overdrive</option>
                            <option value="gotham">Gotham City</option>
                    </select>
            </div>
            <ToastContainer />
        </div>
    );
}
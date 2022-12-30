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

    const emitJoinQueue = ( () => { if ( socket ) socket.emit(ClientEvents.JoinMatchmaking, { SkinPref: SkinPref.current }); });

    const emitLeaveQueue = ( () => { if ( socket ) socket.emit(ClientEvents.LeaveMatchmaking); });

    function RetrieveSkin( event : any )
    {
        if ( event.target.value )
            SkinPref.current = event.target.value;
    }

    return (
        <div className="default">
            <NavBar />
            <p className="SkinSelectorName">Main Skin</p>
            <div className="SkinSelector" >
                    <select id="skin" className="SkinList">
                            <option value="default">Default</option>
                            <option value="SpaceGIF">SpaceGIF</option>
                            <option value="BananaGIF">BananaGIF</option>
                            <option value="neonsunsetoverdrive">Neon Sunset Overdrive</option>
                            <option value="gotham">Gotham City</option>
                    </select>
            </div>
            <div className="MatchmakingBtn">
                <button className="JoinQueue" onClick={() => emitJoinQueue()}> Join Queue </button>
                <button className="LeaveQueue" onClick={() => emitLeaveQueue()}> Leave queue </button>
            </div>
            <ToastContainer />
        </div>
    );
}
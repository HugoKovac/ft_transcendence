import { useContext, useEffect } from 'react';
import { ClientEvents } from '../../../shared/client/Client.Events'
import NavBar from '../../NavBar';
import { WebsocketContext } from './../WebsocketContext';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function GameLobby() {

    const socket = useContext(WebsocketContext);
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.get('id');


    useEffect( () => {

        if ( searchParamsString )
        {
            socket.emit(ClientEvents.JoinLobby, {
                lobbyId: searchParamsString,
          });
        }
        
    }, [searchParamsString, socket]);

    const emitLobby = () => {
        socket.emit(ClientEvents.CreateLobby, {
              skin: "default",
        });
    }

    return (
        <div className='GameMenu'>
            <NavBar />
            <h4>Create or join a lobby !</h4>
            <button className="btn" onClick={() => emitLobby()}>Create Lobby</button>
            <ToastContainer />
        </div>
    );

}


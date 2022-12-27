import { useContext } from 'react';
import GameMenu from '../componenets/Game/GameMenu';
import { WebsocketContext, WebsocketProvider } from '../componenets/Game/WebsocketContext';
import LoginStateContext, { LoginStateProvider } from '../componenets/Login/LoginStateContext';
import NavBar from '../componenets/NavBar';
import '../styles/Game.css'

const Game = () => {
    return (
        <body>
            <div className="SpaceGIF">
                <NavBar />
                <GameMenu/>
            </div>
        </body>
    );
}

export default Game
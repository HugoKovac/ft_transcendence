import { useContext } from 'react';
import GameMenu from '../componenets/Game/GameMenu';
import { WebsocketProvider } from '../componenets/Game/WebsocketContext';
import LoginStateContext from '../componenets/Login/LoginStateContext';
import NavBar from '../componenets/NavBar';
import '../styles/Game.css'

const Game = () => {


    return (
        <body>
            <div className="SpaceGIF">
                <NavBar />
                    <WebsocketProvider>
                        <GameMenu/>
                    </WebsocketProvider>
            </div>
        </body>
    );
}

export default Game
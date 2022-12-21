import GameMenu from '../componenets/Game/GameMenu';
import { socket, WebsocketProvider } from '../componenets/Game/WebsocketContext';
import NavBar from '../componenets/NavBar';
import '../styles/Game.css'

const Game = () => {

    return (
        <body>
            <div className="SpaceGIF">
                <NavBar />
                    <WebsocketProvider value={socket}>
                        <GameMenu/>
                    </WebsocketProvider>
            </div>
        </body>
    );
}

export default Game
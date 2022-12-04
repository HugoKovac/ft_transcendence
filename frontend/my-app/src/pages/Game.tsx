import GameMenu from '../componenets/Game/GameMenu';
import { socket, WebsocketProvider } from '../componenets/Game/WebsocketContext';
import NavBar from '../componenets/NavBar';

const Game = () => {

    return (
        <div>
            <NavBar />
                <WebsocketProvider value={socket}>
                    <GameMenu/>
                </WebsocketProvider>
        </div>
    );
}

export default Game
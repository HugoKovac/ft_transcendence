import GameMenu from '../componenets/Game/GameMenu';
import NavBar from '../componenets/NavBar';
import '../styles/Game.css'

const Game = () => {
    return (
        <div className="SpaceGIF">
            <NavBar />
            <GameMenu/>
        </div>
    );
}

export default Game
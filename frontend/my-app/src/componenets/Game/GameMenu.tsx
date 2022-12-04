import { NavLink } from 'react-router-dom';
import GameLobby from '../Game/GameLobby';

export default function GameMenu() {
    
    return (
        <div>
            <h1> Game under developpement </h1>

        <h1>
            <NavLink to={'/game/matchmaking'} end>
                <button>{'Ranked'}</button>
            </NavLink>
        </h1>


        <h3>
            <NavLink to={'/game/lobby'} end>
                <button>{'Blind'}</button>
            </NavLink>
        </h3>

        </div>

    )
}
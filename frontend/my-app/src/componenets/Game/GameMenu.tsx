import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Unauthorized from '../../pages/Unauthorized';
import '../../styles/Game.css'
import LoginStateContext from '../Login/LoginStateContext';

export default function GameMenu() {
    
        return (
            <div>
                <div className="GameTitle">
                    <text className="PongTitle"> PONG </text>
                </div>
                <div className="GameMode">
                    <NavLink to={'/game/matchmaking'} end>
                        <button className="MatchMakingBtn">{'Ranked'}</button>
                    </NavLink>
                    <NavLink to={'/game/lobby'} end>
                        <button className="PrivateBtn">{'Blind'}</button>
                    </NavLink>
                </div>
            </div>
        )
}
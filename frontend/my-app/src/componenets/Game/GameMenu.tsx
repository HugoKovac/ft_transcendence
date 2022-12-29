import { NavLink } from 'react-router-dom';
import '../../styles/Game.css'

export default function GameMenu() {
    
        return (
            <div>
                <div className="GameTitle">
                    <p className="PongTitle"> PONG </p>
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
//import {} from "react";
import "./profile_style.scss"
import LoginStateContext from "./../Login/LoginStateContext"
import {useContext} from 'react'


type protoPlayer = {
	id : number,
	username : string,
	score : number
}
const MatchDisplay = (props : {player1 : protoPlayer, player2 : protoPlayer, time : Date, P1W : boolean}) : JSX.Element => {
	const player_w : protoPlayer = (props.P1W) ? props.player1 : props.player2
	const player_l : protoPlayer = (props.P1W) ? props.player2 : props.player1
	console.log("Voici les playes : ", JSON.stringify(player_l))
	const {logState} = useContext(LoginStateContext)
	const res : boolean = (props.P1W && logState == props.player1.id) || (!props.P1W && logState != props.player1.id)
	return (
		<div className={"matchDisplay " + (res ? "matchWon" : "matchLoose")}>
			<div className="score">
				<div><p>{player_w.score}</p></div>
				<div><p>-</p></div>
				<div><p>{player_l.score}</p></div>
			</div>
			<div className="playersname">
					<div className={"winner"}>
						<p>{player_w.username}</p>
					</div>
					<div><p>VS</p></div>
					<div className={"loser"}>
						<p>{player_l.username}</p>
					</div>
				</div>
		</div>
	)
}

export default MatchDisplay
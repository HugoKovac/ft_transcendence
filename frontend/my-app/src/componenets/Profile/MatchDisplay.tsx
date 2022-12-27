//import {} from "react";
import "./profile_style.scss"

type protoPlayer = {
	id : number,
	username : string,
	score : number
}
const MatchDisplay = (props : {player1 : protoPlayer, player2 : protoPlayer, time : Date}) : JSX.Element => {
	const isEqual : boolean = (props.player1.score == props.player2.score)
	const player_w : protoPlayer = (props.player1.score > props.player2.score) ? props.player1 : props.player2
	const player_l : protoPlayer = (props.player1.score > props.player2.score) ? props.player2 : props.player1
	function dataParsing() : void
	{

	}
	return (
		<div className="matchDisplay">
			<div className="score">
				<div><p>{player_w.score}</p></div>
				<div><p>-</p></div>
				<div><p>{player_l.score}</p></div>
			</div>
			<div className="playersname">
					<div className={(isEqual) ? "equal" : "winner"}>
						<p>{player_w.username}</p>
					</div>
					<div><p>VS</p></div>
					<div className={(isEqual) ? "equal" : "loser"}>
						<p>{player_l.username}</p>
					</div>
				</div>
		</div>
	)
}

export default MatchDisplay
import LoginStateContext from "./../Login/LoginStateContext"
import {useContext, useState, useEffect} from 'react'
import MatchDisplay from "./MatchDisplay"
import AchivementDisplay from "./AchivementDisplay"
import "./profile_style.scss"
import axios from "axios"

type protoMatch = {
	playerone_id : number,
	playertwo_id : number,
	playerone_score : number,
	playertwo_score : number,
	playerone_username : string,
	playertwo_username : string,
	date : Date
}

const GamePartProfile = (props : {user_id : number}) => {
	const {logState} = useContext(LoginStateContext)
	const [History, setHistory]  = useState<protoMatch[]>([])
	useEffect(() => {
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/profile/', withCredentials: true})
		req_base.post("getDataGames", {user_id : logState}).then((res) => {
			if (!res.data)
				console.log("Error : no data transferred")
			setHistory(res.data)
		})
	}, [])
	/*const History : protoMatch[] = [
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 2, playertwo_score : 50,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 36, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 30, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 31, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 32, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 4, playertwo_score : 2,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
		
		{ playerone_id : 23, playertwo_id : logState, playerone_score : 2, playertwo_score : 50,
			playerone_username : "string2", playertwo_username : "sBob", date : new Date()},
		{ playerone_id : logState, playertwo_id : 34, playerone_score : 50, playertwo_score : 50,
			playerone_username : "Bob", playertwo_username : "string", date : new Date()},
				]*/
	const games : JSX.Element[] = History.map((e) => {
		return <MatchDisplay player1={{id : e.playerone_id, username : e.playerone_username, score : e.playerone_score}}
		player2={{id : e.playertwo_id, username : e.playertwo_username, score : e.playertwo_score}} time={e.date}/>
	})
	const displayListGames = () : JSX.Element => {
		if ( games.length == 0)
			return <div className="allMatchs"><p className="voidMessage">Nothing to see here ...</p></div>
		return <div className="allMatchs">{games}</div>
	}
	return <div>
		<AchivementDisplay history={History}/>
		<h1>Last Games :</h1>
		{displayListGames()}
	</div>
}

export default GamePartProfile
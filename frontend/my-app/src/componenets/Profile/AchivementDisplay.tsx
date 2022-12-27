import { useContext } from "react"
import { receiveMessageOnPort } from "worker_threads"
import LoginStateContext from "./../Login/LoginStateContext"
import "./profile_style.scss"

type protoMatch = {
	playerone_id : number,
	playertwo_id : number,
	playerone_score : number,
	playertwo_score : number,
	playerone_username : string,
	playertwo_username : string,
	date : Date
}
const AchivementDisplay = (props : {history : protoMatch[]}) => {
	const {logState} = useContext(LoginStateContext)
	const copyHistory : {data : protoMatch, isEqual : boolean}[] = props.history.map((e) => {
		if (e.playertwo_score > e.playerone_score)
		{
			let buffId : number = e.playerone_id
			e.playerone_id = e.playertwo_id 
			e.playertwo_id = buffId
			let buffusername : string = e.playerone_username
			e.playerone_username = e.playertwo_username
			e.playertwo_username = buffusername
			let buffscore : number = e.playerone_score
			e.playerone_score = e.playertwo_score
			e.playertwo_score = buffscore
		}
		const isEqual : boolean = (e.playerone_score == e.playertwo_score)
		return {data : e, isEqual : isEqual}
	})

	function ach1game() : JSX.Element
	{
		const result : string = " Play 1 game"
		let emote : string = "❌"
		let className : string = "not-achieved"
		if (copyHistory.length > 1)
		{
			emote = "✔️"
			className = "achieved"
		}
		return (<p className={className}>{emote + result}</p>)
	}
	function achWin(ach : number) : JSX.Element
	{
		const result : string = " Win " + ach + " games"
		let emote : string = "❌"
		let className : string = "not-achieved"
		if (copyHistory.filter((e) => (e.data.playerone_id == logState && !e.isEqual)).length >= ach)
		{
			emote = "✔️"
			className = "achieved"
		}
		return (<p className={className}>{emote + result}</p>)
	}
	function achDifferents() : JSX.Element
	{
		const result : string = " Play with 5 different Players"
		let emote : string = "❌"
		let className : string = "not-achieved"
		const players : number [] = copyHistory.map((e) => {
			if (e.data.playerone_id == logState)
				return e.data.playertwo_id
			return e.data.playerone_id
		})
		let diffPlayers : number[] = players.filter((e) => players.lastIndexOf(e) == players.indexOf(e))
		if (diffPlayers.length >= 5)
		{
			emote = "✔️"
			className = "achieved"
		}
		return (<p className={className}>{emote + result}</p>)
	}
	function recap() : JSX.Element
	{
		const total :number = copyHistory.length
		const win : number = copyHistory.filter((e) => (e.data.playerone_id == logState && !e.isEqual)).length
		const loose : number = copyHistory.filter((e) => (e.data.playerone_id != logState && !e.isEqual)).length
		const equal : number = copyHistory.filter((e) => (e.isEqual)).length
		return (<div className="recap">
			<h1>Summary :</h1>
			<div className="listSummary">
			<div><p >TOTAL : {total}</p></div>
			<div><p className="achieved">WIN : {win}</p></div>
			<div><p className="not-achieved">LOOSE : {loose}</p></div>
			<div><p>DRAW : {equal}</p></div>
			</div>
		</div>)
	}

	return (<div className="achivementsDiv">
		{recap()}
		<div className="title">
			<h1>Achivements : </h1>
		</div>
		<div className="listAchivements">
			{ach1game()}<br/>
			{achWin(2)}<br/>
			{achWin(5)}<br/>
			{achWin(10)}<br/>
			{achWin(20)}<br/>
			{achDifferents()}<br/>
		</div>
	</div>)
}

export default AchivementDisplay
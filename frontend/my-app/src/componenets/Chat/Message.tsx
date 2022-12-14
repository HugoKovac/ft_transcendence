import { useNavigate } from "react-router"
import Parsepp from "../imgParse"
import { createSearchParams } from "react-router-dom"

const Message = (props: { content: string, own: boolean, username: string, userPP: string, sender_id: number, date: string, invite: boolean }) => {
	const date = new Date(props.date).toLocaleString()
	const nav = useNavigate()

	const lobbyidquery = { id: props.content }

	return <div className={props.own ? "msg own" : "msg"}>
		<div className="info">
			<img className={props.own ? "own" : ""} src={Parsepp(props.userPP)} alt="pp" onClick={() => { nav(`../../Profile?userId=${props.sender_id}`) }} />
			<p>{props.username}</p>
			<p className="date">{date}</p>
		</div>
		{!props.invite && <p>{props.content}</p>}
		{props.invite && <button className="PongDuel" onClick={() => {nav({pathname:'/game/lobby', search: `?${createSearchParams(lobbyidquery)}`})}}>Join a 1v1 Pong</button>}
	</div>
}
export default Message
import { useNavigate } from "react-router"

const Message = (props: { content: string, own: boolean, username: string, userPP: string, sender_id: number, date: string, invite: boolean }) => {
	const date = new Date(props.date).toLocaleString()
	const nav = useNavigate()

	console.log(props.invite)

	return <div className={props.own ? "msg own" : "msg"}>
		<div className="info">
			<img className={props.own ? "own" : ""} src={props.userPP} alt="pp" onClick={() => { nav(`../../Profile?userId=${props.sender_id}`) }} />
			<p>{props.username}</p>
			<p className="date">{date}</p>
		</div>
		{!props.invite && <p>{props.content}</p>}
		{props.invite && <a onClick={() => {nav(`../../game/lobby?id=${props.content}`)}}>Hey wanna play a 1v1 Pong ?</a>}
	</div>
}

export default Message
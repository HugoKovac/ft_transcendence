import { useNavigate } from "react-router"

const Message = (props: { content: string, own: boolean, username: string, userPP: string, sender_id: number, date: string }) => {
	const date = new Date(props.date).toLocaleString()
	const nav = useNavigate()

	return <div className={props.own ? "msg own" : "msg"}>
		<div className="info">
			<img className={props.own ? "own" : ""} src={props.userPP} alt="pp" onClick={() => { nav(`../../Profile?userId=${props.sender_id}`) }} />
			<p>{props.username}</p>
			<p className="date">{date}</p>
		</div>
		<p>{props.content}</p>
	</div>
}

export default Message
import console from "console"

const Message = (props : {content:string, own: boolean, username: string, userPP:string, date:Date}) => {
	const format = [props.username, '  ', props.userPP]

	return <div className={props.own ? "msg own" : "msg"}>
			<div className="info">
				<img className={props.own ? "own" : ""} src={props.userPP} alt="pp" />
				<p>{props.username}</p>
				<p className="date">date:</p>
			</div>
			<p>{props.content}</p>
		</div>
}

export default Message
const Message = (props : {content:string, own: boolean}) => {
	return <p className={props.own ? "msg own" : "msg"}>{props.content}</p>
}

export default Message
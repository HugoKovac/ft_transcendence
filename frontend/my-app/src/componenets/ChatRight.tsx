import ChatInput from "./ChatInput"

const ChatRight = (props : {conv:number, msgList : JSX.Element[], setNewMsg: (v:boolean)=>void}) => {
	return <div className='chatBox'>
		<div className='msgArea'>
			{props.msgList}
		</div>
		<ChatInput conv_id={props.conv} state={props.setNewMsg}/>
	</div>
}

export default ChatRight
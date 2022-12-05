import ChatInput from "./ChatInput"

const ChatRight = (props : {conv:number, msgList : JSX.Element[], setNewMsg: (v:boolean)=>void, setRefresh:(v:boolean)=>void, nav:number}) => {
	return <div className='chatBox'>
		<div className='msgArea'>
			{props.msgList}
		</div>
		<ChatInput conv_id={props.conv} state={props.setNewMsg} setRefresh={props.setRefresh} nav={props.nav}/>
	</div>
}

export default ChatRight
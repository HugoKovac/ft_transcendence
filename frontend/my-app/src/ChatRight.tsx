import ChatInput from "./componenets/ChatInput"
import ChooseFriend from "./componenets/ChooseFriend"
import Popup from "./componenets/Popup"

const ChatRight = (props : {conv:number, msgList : JSX.Element[], setNewMsg: (v:boolean)=>void}) => {
	return <div className='chatBox'>
		<div className='msgArea'>
			{props.msgList}
		</div>
		<ChatInput friend_id={props.conv} state={props.setNewMsg}/>
	</div>
}

export default ChatRight
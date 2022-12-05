import ChatInput from "./ChatInput"
import { userType } from "./ChatBox"

const ChatRight = (props : {conv:number, msgList : JSX.Element[], setNewMsg: (v:boolean)=>void, setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[]}) => {
	return <div className='chatBox'>
		<div className='msgArea'>
			{props.msgList}
		</div>
		<ChatInput conv_id={props.conv} state={props.setNewMsg} setRefresh={props.setRefresh} nav={props.nav} userGroupList={props.userGroupList} />
	</div>
}

export default ChatRight
import ChatInput from "./ChatInput"
import { userType } from "./ChatBox"

const ChatRight = (props : {conv:number, msgList : JSX.Element[], setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[], setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean, passwordInput:string, setPasswordInput:(v:string)=>void}) => {
	// const renderInput = props.isConvPrivate === false
	// ? <ChatInput 
	// 	conv_id={props.conv} setRefresh={props.setRefresh}
	// 	nav={props.nav} userGroupList={props.userGroupList} setRefreshConvList={props.setRefreshConvList}
	// 	isConvPrivate={props.isConvPrivate}passwordInput={props.passwordInput}
	// 	setPasswordInput={props.setPasswordInput}
	// />
	// : <></>
	
	return <div className='chatBox'>
		<div className='msgArea'>
			{props.msgList}
		</div>
		<ChatInput 
			conv_id={props.conv} setRefresh={props.setRefresh}
			nav={props.nav} userGroupList={props.userGroupList} setRefreshConvList={props.setRefreshConvList}
			isConvPrivate={props.isConvPrivate} passwordInput={props.passwordInput}
			setPasswordInput={props.setPasswordInput}
		/>
	</div>
}

export default ChatRight
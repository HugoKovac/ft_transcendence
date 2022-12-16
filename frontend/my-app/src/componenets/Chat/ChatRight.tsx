import ChatInput from "./ChatInput"
import { userType } from "./ChatBox"

const ChatRight = (props : {conv:number, msgList : JSX.Element[], setConv: (v:number)=>void, setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[], setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean, passwordInput:string, setPasswordInput:(v:string)=>void, goodPass: {conv_id:number, passState:boolean, password:string}[], setHideRight: (b:boolean)=>void, isAdmin: boolean}) => {	
	return <div className='chatBox'>
		<div className='msgArea'>
			{props.msgList}
		</div>
		<ChatInput 
			conv_id={props.conv} setRefresh={props.setRefresh} setConv={props.setConv}
			nav={props.nav} userGroupList={props.userGroupList} setRefreshConvList={props.setRefreshConvList}
			isConvPrivate={props.isConvPrivate} passwordInput={props.passwordInput} isAdmin={props.isAdmin}
			setPasswordInput={props.setPasswordInput} goodPass={props.goodPass} setHideRight={props.setHideRight}
		/>
	</div>
}

export default ChatRight
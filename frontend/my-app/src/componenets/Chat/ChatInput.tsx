import Cookies from "js-cookie";
import { useState } from "react";
import { io } from "socket.io-client"
import Popup from "../Popup";
import AdminPanel from "./AdminPanel";
import './Chat.scss'
import { userType } from "./ChatBox";

type messageObj = {
	conv_id:number,
	message:string,
}

type groupMessageObj = {
	group_conv_id:number,
	message:string,
}

function ChatInput({conv_id, state, setRefresh, nav, userGroupList, setRefreshConvList}: {conv_id:number, state: (v:boolean)=>void, setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[], setRefreshConvList: (v:boolean)=>void} ){
	const socket = io("localhost:3000", {
		auth: (cb) => {
			cb({
			  token: Cookies.get('jwt')
			});
		  }
	})

	const [inputMessage, setInputMessage] = useState<string>('')
	const payloadMsg: messageObj = {
		conv_id: conv_id,
		message: inputMessage
	}

	const payloadGroupMsg: groupMessageObj = {
		group_conv_id: conv_id,
		message: inputMessage
	}

	const SendMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('message', payloadMsg)
		setInputMessage('')
		state(true)
	}

	const SendGroupMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('groupMessage', payloadGroupMsg)
		setInputMessage('')
		state(true)
	}
	
	socket.on("refresh", () => {
		console.log(`refresh`);
		setRefresh(true)
	});

	const [panelTrigger, setPanelTrigger] = useState(false)
	//! and if admin role
	const admin_btn_panel =  nav === 2 ? <button className="adminBtnPanel" onClick={() => {setPanelTrigger(true)}}>Manage</button> : <></> 
	//! and if admin role
	const panelPopup = nav === 2 ? <Popup trigger={panelTrigger} setter={{popup: panelTrigger, setPopup: setPanelTrigger}}> 
		<h1>Manage Group</h1>
		<AdminPanel userGroupList={userGroupList} conv_id={conv_id} setPanelTrigger={setPanelTrigger} setRefreshConvList={setRefreshConvList} />
	 </Popup>
	 : <></>

	return <form onSubmit={nav === 1 ? SendMessage : SendGroupMessage} className='chatInput'>
			<input className="chat-input" placeholder="type your message..." autoFocus maxLength={300} autoComplete="off" onChange={(e) => {setInputMessage(e.target.value)}} value={inputMessage} type="text" name="msg"/>
			<button>Send</button>
			{admin_btn_panel}
			{panelPopup}
		</form>
}

export default ChatInput
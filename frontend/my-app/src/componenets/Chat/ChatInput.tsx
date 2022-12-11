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

type privateGroupMessageObj = {
	group_conv_id:number,
	message:string,
	password:string,
}

function ChatInput({conv_id, setRefresh, nav, userGroupList, setConv, setRefreshConvList, isConvPrivate, passwordInput, setPasswordInput, goodPass}:
	{conv_id:number, setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[], setConv: (v:number)=>void, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean, passwordInput:string, setPasswordInput:(v:string)=>void, goodPass: {conv_id:number, passState:boolean, password:string}[]} ){
	const socket = io("localhost:3000", {
		auth: (cb) => {
			cb({
			  token: Cookies.get('jwt')
			});
		  }
	})

	const findGoodPass = (conv_id:number) => {
		for (let i of goodPass)
			if (i.conv_id === conv_id)
				return i
		return goodPass[0]
	}

	const [inputMessage, setInputMessage] = useState<string>('')
	const payloadMsg: messageObj = {
		conv_id: conv_id,
		message: inputMessage
	}

	const payloadGroupMsg: groupMessageObj = {
		group_conv_id: conv_id,
		message: inputMessage
	}

	const payloadPrivateGroupMsg: privateGroupMessageObj = {
		group_conv_id: conv_id,
		message: inputMessage,
		password: findGoodPass(conv_id)?.password
	}

	const SendMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('message', payloadMsg)
		setInputMessage('')
	}

	const SendGroupMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('groupMessage', payloadGroupMsg)
		setInputMessage('')
	}

	const SendPrivateGroupMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('privateGroupMessage', payloadPrivateGroupMsg)
		setInputMessage('')
	}
	
	socket.on("refresh", () => {
		setRefresh(true)
	});

	const [panelTrigger, setPanelTrigger] = useState(false)
	//! and if admin role and if private check if log
	const admin_btn_panel =  nav === 2 ? <button className="adminBtnPanel" onClick={() => {setPanelTrigger(true)}}>Manage</button> : <></> 
	//! and if admin role and if private check if log
	const panelPopup = nav === 2 ? <Popup trigger={panelTrigger} setPopup={setPanelTrigger}> 
		<h1>Manage Group</h1>
		<AdminPanel userGroupList={userGroupList} conv_id={conv_id} setPanelTrigger={setPanelTrigger}
		setRefreshConvList={setRefreshConvList} isConvPrivate={isConvPrivate} setConv={setConv}
		passwordInput={passwordInput} setPasswordInput={setPasswordInput}/>
	 </Popup>
	 : <></>

	let submitHandler = nav === 1 ? SendMessage : SendGroupMessage
	if (isConvPrivate)
		submitHandler = SendPrivateGroupMessage

	return <form onSubmit={submitHandler} className='chatInput'>
			<input
				className="chat-input" placeholder="type your message..." autoFocus maxLength={300}
				autoComplete="off" onChange={(e) => {setInputMessage(e.target.value)}}
				value={inputMessage} type="text" name="msg"
			/>
			<button>Send</button>
			{admin_btn_panel}
			{panelPopup}
		</form>
}

export default ChatInput
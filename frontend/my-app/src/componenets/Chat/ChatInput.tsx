import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { io } from "socket.io-client"
import Popup from "../Popup";
import AdminPanel from "./AdminPanel";
import './Chat.scss'
import { userType } from "./ChatBox";

function ChatInput({conv_id, setRefresh, nav, userGroupList, setConv, setRefreshConvList, isConvPrivate, passwordInput, setPasswordInput, goodPass}:
	{conv_id:number, setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[], setConv: (v:number)=>void, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean, passwordInput:string, setPasswordInput:(v:string)=>void, goodPass: {conv_id:number, passState:boolean, password:string}[]} ){
	
	const [inputMessage, setInputMessage] = useState<string>('')
	const [channel, setChannel] = useState<string | null>(null)
	const [perm] = useState({})
	const [msg, setMsg] = useState('')

	
	useEffect(()=>{
		const findGoodPass = (conv_id:number) => {
			for (let i of goodPass)
				if (i.conv_id === conv_id)
					return i
			return goodPass[0]
		}

		if (channel){
			const socket = io("localhost:3000", {
				auth: (cb) => {
					cb({
					  token: Cookies.get('jwt')
					});
				  }
			})

			if (channel === 'message')
				socket.emit('message', {
					conv_id: conv_id,
					message: msg
				})
			else if (channel === 'groupMessage')
				socket.emit('groupMessage', {
					group_conv_id: conv_id,
					message: msg
				})
			else if (channel === 'privateGroupMessage')
				socket.emit('privateGroupMessage', {
					group_conv_id: conv_id,
					message: msg,
					password: findGoodPass(conv_id)?.password
				})

			setInputMessage('')
			let cpy = channel
			setChannel(null)
			return () => {socket.off(cpy)}
		}
	}, [channel, conv_id, goodPass, msg])
	
	useEffect(()=>{
		const socket = io("localhost:3000", {
			auth: (cb) => {
				cb({
				  token: Cookies.get('jwt')
				});
			  }
		})
		socket.on("refresh", () => {
			setRefresh(true)
		});

		return () => {socket.off('refresh')}
	}, [perm, setRefresh])

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

	return <form onSubmit={(e) => {
		e.preventDefault()
		setMsg(inputMessage)
		if (nav === 1)
			setChannel('message')
		else if (nav === 2 && !isConvPrivate)
			setChannel('groupMessage')
		else if (nav === 2 && isConvPrivate)
			setChannel('privateGroupMessage')

	}} className='chatInput'>
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
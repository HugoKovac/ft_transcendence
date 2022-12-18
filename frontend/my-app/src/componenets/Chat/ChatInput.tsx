import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"
import LoginStateContext from "../Login/LoginStateContext";
import Popup from "../Popup";
import AdminPanel from "./AdminPanel";
import './Chat.scss'
import { userType } from "./ChatBox";

function ChatInput({conv_id, setRefresh, nav, userGroupList, setConv, setRefreshConvList, isConvPrivate, passwordInput, setPasswordInput, goodPass, setHideRight, isAdmin}:
	{conv_id:number, setRefresh:(v:boolean)=>void, nav:number, userGroupList:userType[], setConv: (v:number)=>void, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean, passwordInput:string, setPasswordInput:(v:string)=>void, goodPass: {conv_id:number, passState:boolean, password:string}[], setHideRight: (v:boolean)=>void, isAdmin:boolean} ){
	
	const [inputMessage, setInputMessage] = useState<string>('')
	const [channel, setChannel] = useState<string | null>(null)
	const [perm] = useState({})
	const [msg, setMsg] = useState('')
	const setHideRightCpy = setHideRight
	const setRefreshConvListCpy = setRefreshConvList
	const convCpy = conv_id
	
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
	
	const [ids, setIds] = useState<number[]>([])

	useEffect(() => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})

		axInst.post('get_conv_id').then((res) => {
			setIds(res.data)
		}).catch((e) => {console.error(e)})
	}, [perm])

	const {logState} = useContext(LoginStateContext)

	useEffect(()=>{
		// if (nav !== 2)
		// 	return
	
		const socket = io("localhost:3000", {
			auth: (cb) => {
				cb({
					token: Cookies.get('jwt')
				});
			}
		})

		for (let i of ids){
			socket.on(i.toString(), () => {
				console.log(i.toString())
				setRefresh(true)
				setRefreshConvListCpy(true)
			});
		}

		return () => {
			for (let i of ids)
				socket.off(i.toString());
		}
	}, [perm, setRefresh, ids, setRefreshConvListCpy])

	useEffect(() => {
		if (nav !== 2)
			return
		const socket = io("localhost:3000", {
			auth: (cb) => {
				cb({
					token: Cookies.get('jwt')
				});
			}
		})

		socket.on(logState.toString(), () => {
			// console.log(logState.toString())
			setHideRightCpy(true)
			setRefreshConvListCpy(true)
			setRefresh(true)
			alert('You have been ban of this group')
		});

		return (() => {
			socket.off(logState.toString())
		})

	}, [perm, logState, setHideRightCpy, setRefreshConvListCpy, setRefresh])
	
	useEffect(() => {
		if (nav !== 2)
			return
		const socket = io("localhost:3000", {
			auth: (cb) => {
					cb({
					token: Cookies.get('jwt')
				});
			}
		})
			socket.on(`unban${logState}`, () => {
				// console.log(`unban${logState}`)
				setRefreshConvListCpy(true)
				setHideRightCpy(false)
				setRefresh(true)
			});
		return (() => {
		})

	}, [perm, logState, setRefreshConvListCpy, setHideRightCpy, setRefresh])

	useEffect(() => {
		if (nav !== 2)
			return
		const socket = io("localhost:3000", {
			auth: (cb) => {
					cb({
					token: Cookies.get('jwt')
				});
			}
		})
			socket.on(`resetConv${convCpy}`, () => {
				setRefreshConvListCpy(true)
				setHideRightCpy(false)
				setRefresh(true)
				setConv(0)
			});
		return (() => {
			socket.off(`resetConv${convCpy}`)
		})
	}, [perm, setConv, convCpy, setRefreshConvListCpy, setRefresh, setHideRightCpy])

	const [panelTrigger, setPanelTrigger] = useState(false)
	const admin_btn_panel =  nav === 2 && isAdmin ? <button className="adminBtnPanel" onClick={() => {setPanelTrigger(true)}}>Manage</button> : <></> 
	const panelPopup = nav === 2 && isAdmin ? <Popup trigger={panelTrigger} setPopup={setPanelTrigger}> 
		<h1>Manage Group</h1>
		<AdminPanel userGroupList={userGroupList} conv_id={conv_id} setPanelTrigger={setPanelTrigger}
		setRefreshConvList={setRefreshConvList} isConvPrivate={isConvPrivate} setConv={setConv}
		passwordInput={passwordInput} setPasswordInput={setPasswordInput}/>
	 </Popup>
	 : <></>

	return <div className='btn-wrapper'>
		<form onSubmit={(e) => {
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
			</form>
			{admin_btn_panel}
			{panelPopup}
	</div>
}

export default ChatInput
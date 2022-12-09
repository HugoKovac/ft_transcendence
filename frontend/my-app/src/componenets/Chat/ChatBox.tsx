import axios from "axios"
import React, { useEffect, useState } from "react"
import Popup from "../Popup"
import ChatRight from "./ChatRight"
import Message from "./Message"

export type userType = {
	id:number,
	username:string,
	email:string,
	pp:string,
	providerId:string,
}

const ChatBox = (props: {conv:number, logState:number, nav:number, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean}) => {
	const logStateCpy = props.logState
	const convCpy = props.conv
	const navCpy = props.nav
	const isConvPrivateCpy = props.isConvPrivate

	const [refresh, setRefresh] = useState(false)
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} username='' userPP='' date='' />])
	const [userGroupList, setUserGroupList] = useState<userType[]>([])
	const [passwordPopupState, setPasswordPopupState] = useState(false)
	const [passwordInput, setPasswordInput] = useState('')
	const [requestPrivate, setRequestPrivate] = useState(false)
	const [goodPass, setGoodPass] = useState(false)

	let passwordPopup = <Popup trigger={passwordPopupState} setPopup={setPasswordPopupState}>
		<label htmlFor="password" id='password'><h1>Password :</h1></label>
		<input type="password" onChange={e => {setPasswordInput(e.target.value)}} />
		<button onClick={(e) => {e.preventDefault(); setRequestPrivate(true)}}>Verify</button>
	</Popup>

	useEffect(() => {//* DM
		if (navCpy !== 1 || convCpy === 0)
			return

		setGoodPass(true)

		const asyncFetch = async ()=>{
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})//axios create
			
			await axInst.post('get_conv_msg', {conv_id: convCpy}).then((res) => {
				const list = []
				const ownMsg = res.data.user.id === logStateCpy ? res.data.user : res.data.user2//bulle bleu droite
				const otherMsg = res.data.user2.id === logStateCpy ? res.data.user2 : res.data.user//bule grise gauche
				
				for (let i of res.data.message){
					const user = i.sender_id === parseInt(ownMsg.id) ? ownMsg : otherMsg
					
					list.unshift(
						<Message 
							key={i.msg_id} own={i.sender_id === logStateCpy ? true : false}
							content={i.message} username={user.username} userPP={user.pp} date={i.send_at}//mettre info du message plus bon user dans message
						/>
					)
				}
				setMsgList(list)
			})
		}
		try{
			asyncFetch()
		}catch(e){
			console.error(e, "DM CONV")
		}
		setRefresh(false)
	}, [navCpy, refresh, logStateCpy, convCpy, setGoodPass])

	useEffect(() => {//* PUBLIC GROUP
		if (navCpy !== 2 || isConvPrivateCpy !== false || convCpy === 0)
			return

		setGoodPass(true)

		const asyncFetch = async ()=>{
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})//axios create
			
			await axInst.post('get_group_msg', {group_conv_id: convCpy}).then(res => {
				let user
				const list = []

				setUserGroupList(res.data.users)//set la list des users pour savoir ou afficher dans AdminPanel
				for (let i of res.data.messages){
					for (let j of res.data.users){
						if (i.sender_id === parseInt(j.id)){//prendre le bon user
							user = j
							break
						}
					}
					
					list.unshift(
						<Message
							key={i.msg_id} own={i.sender_id === logStateCpy ? true : false}
							content={i.message} username={user.username} userPP={user.pp} date={i.send_at}
						/>//mettre info du message plus bon user dans message
					)
				}

				setMsgList(list)
			})
		}
		try{
			asyncFetch()
		}catch(e){
			console.error(e, "PUBLIC GROUP CONV")
		}
		setRefresh(false)
	}, [navCpy, refresh, logStateCpy, convCpy, setGoodPass])

	useEffect(() => {//* PRIVATE GROUP
		if (navCpy !== 2 || isConvPrivateCpy !== true)
			return
		setGoodPass(false)
		setPasswordPopupState(true)//si group private afficher la popup du password
		if (!convCpy || !requestPrivate)
			return
			
		setRequestPrivate(false)
		const asyncFetch = async ()=>{
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})//axios create
			
			await axInst.post('get_group_secret_conv_msg', {group_conv_id: convCpy, password: passwordInput}).then(res => {
				if (!res.data)
					return //* wrong password
				setGoodPass(true)
				setPasswordPopupState(false)
				const list:JSX.Element[] = []
				let user
				
	
				setUserGroupList(res.data.users)
				for (let i of res.data.messages){
					for (let j of res.data.users){
						if (i.sender_id === parseInt(j.id)){
							user = j
							break
						}
					}
					
					list.unshift(
					<Message
					key={i.msg_id} own={i.sender_id === logStateCpy ? true : false}
					content={i.message} username={user.username} userPP={user.pp} date={i.send_at}
					/>
					)
				}
				setMsgList(list)
			})
		}
		try{
			asyncFetch()
		}catch(e){
			console.error(e, "PUBLIC GROUP CONV")
		}
		setPasswordPopupState(false)
		setRefresh(false)
	}, [navCpy, refresh, logStateCpy, convCpy, requestPrivate, setPasswordPopupState, setRequestPrivate, setGoodPass])

	let right = <ChatRight conv={props.conv} msgList={msgList}
		setRefresh={setRefresh} nav={props.nav}
		userGroupList={userGroupList} setRefreshConvList={props.setRefreshConvList}
		isConvPrivate={props.isConvPrivate} passwordInput={passwordInput}
		setPasswordInput={setPasswordInput}
	/>
	if (props.conv === 0 || !goodPass)
		right = <div className='chatBox' />

	return <React.Fragment>
		{passwordPopup}
		{right}
	</React.Fragment>
}

export default ChatBox
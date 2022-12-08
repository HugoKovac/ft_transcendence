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

const ChatBox = (props: {conv:number, logState:number, newMsg:boolean, setNewMsg:(v:boolean)=>void, nav:number, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean}) => {
	const newMsgCpy = props.newMsg
	const setNewMsgCpy = props.setNewMsg
	const logStateCpy = props.logState
	const convCpy = props.conv
	const [refresh, setRefresh] = useState(false)
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} username='' userPP='' date='' />])
	const navCpy = props.nav
	const request:string = props.nav === 1 ? 'get_conv_msg' : 'get_group_msg'
	const [userGroupList, setUserGroupList] = useState<userType[]>([])
	const [passwordPopupState, setPasswordPopupState] = useState(false)
	const [passwordInput, setPasswordInput] = useState('')
	const [requestPrivate, setRequestPrivate] = useState(false)

	let passwordPopup = <Popup trigger={passwordPopupState} setPopup={setPasswordPopupState}>
		<label htmlFor="password" id='password'><h1>Password :</h1></label>
		<input type="password" onChange={e => {setPasswordInput(e.target.value)}} />
		<button onClick={(e) => {e.preventDefault(); setRequestPrivate(true)}}>Verify</button>
	</Popup>
	
	
	useEffect(() =>{
		const payload = navCpy === 1 ? {conv_id: convCpy} : {group_conv_id: convCpy}
		if (convCpy === 0)
			return
		const fetchMsg = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})
			
			if (props.isConvPrivate)
				setPasswordPopupState(true)

			else
				axInst.post(request, payload).then(res => {
					const list = []

					if (navCpy === 1){
						const ownMsg = res.data.user.id === logStateCpy ? res.data.user : res.data.user2
						const otherMsg = res.data.user2.id === logStateCpy ? res.data.user2 : res.data.user
						
						for (let i of res.data.message){
							const user = i.sender_id === parseInt(ownMsg.id) ? ownMsg : otherMsg
							
							list.unshift(
								<Message 
									key={i.msg_id} own={i.sender_id === logStateCpy ? true : false}
									content={i.message} username={user.username} userPP={user.pp} date={i.send_at}
								/>
							)
						}
					}
					else{
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
					}

					setMsgList(list)
				}).catch(e => {console.error(e, `error when fetch http://localhost:3000/api/message/${request}`)})

			setNewMsgCpy(false)
		}
		fetchMsg()
		setRefresh(false)
	}, [newMsgCpy, navCpy, setNewMsgCpy, logStateCpy, setMsgList, convCpy, refresh, setUserGroupList, request])

	useEffect(() => { 
		const list:JSX.Element[] = []
		const fetch = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			axInst.post('get_group_secret_conv_msg', {group_conv_id: convCpy, password: passwordInput}).then(res => {
				setPasswordPopupState(false)
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
			})
		}
		fetch()
		
		setMsgList(list)
		setRequestPrivate(false)
	}, [requestPrivate, setRequestPrivate])

	//Faire un new useEffect avec des states groupConv et newConvMsg

	let right = <ChatRight conv={props.conv} msgList={msgList}
		setNewMsg={props.setNewMsg} setRefresh={setRefresh} nav={props.nav}
		userGroupList={userGroupList} setRefreshConvList={props.setRefreshConvList}
		isConvPrivate={props.isConvPrivate} passwordInput={passwordInput}
		setPasswordInput={setPasswordInput}
	/>
	if (props.conv === 0)
		right = <div className='chatBox' />

	return <React.Fragment>
		{passwordPopup}
		{right}
	</React.Fragment>
}

export default ChatBox
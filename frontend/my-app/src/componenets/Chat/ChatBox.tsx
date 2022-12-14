import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import Popup from "../Popup"
import ChatRight from "./ChatRight"
import Message from "./Message"
import './PassPopup.scss'

export type userType = {
	id:number,
	username:string,
	email:string,
	pp:string,
	providerId:string,
}

const ChatBox = (props: {conv:number, logState:number, setConv: (v:number)=>void, nav:number, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean}) => {
	const logStateCpy = props.logState
	const convCpy = props.conv
	const navCpy = props.nav
	const isConvPrivateCpy = props.isConvPrivate

	const [refresh, setRefresh] = useState(false)
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} username='' userPP='' date='' sender_id={0} invite={false}/>])
	const [userGroupList, setUserGroupList] = useState<userType[]>([])
	const [passwordPopupState, setPasswordPopupState] = useState(false)
	const [passwordInput, setPasswordInput] = useState('')
	const [requestPrivate, setRequestPrivate] = useState(false)
	const [goodPass, setGoodPass] = useState([{conv_id: 0, passState: true, password:''}])
	const [isAdmin, setIsAdmin] = useState(false)

	let passwordPopup = <Popup trigger={passwordPopupState} setPopup={setPasswordPopupState}>
		<label htmlFor="password" id='password'><h1>Unlock the group :</h1></label>
		<input type="password" placeholder="Password..." className="group-pass" onChange={e => {setPasswordInput(e.target.value)}} />
		<button className="btn-pass" onClick={(e) => {e.preventDefault(); setRequestPrivate(true)}}>Verify</button>
	</Popup>

	const findGoodPass = useCallback( (conv_id:number) => {
		for (let i of goodPass)
			if (i.conv_id === conv_id)
				return i
		return undefined
	}, [goodPass])

	const ChangeGoodPass = useCallback( (conv_id:number, val:boolean, pass:string) => {
		const cpy = goodPass
		for (let i of cpy)
			if (i.conv_id === conv_id){
				i.passState = val
				i.password = pass
				return cpy
			}
		return cpy
	}, [goodPass])

	useEffect(() => {//* DM
		if (navCpy !== 1 || convCpy === 0)
			return

		if (!findGoodPass(convCpy))
			setGoodPass(goodPass.concat({conv_id: convCpy, passState: true, password:''}))

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
							key={i.msg_id} own={i.sender_id === logStateCpy ? true : false} sender_id={i.sender_id} invite={i.invite}
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
	}, [navCpy, refresh, logStateCpy, convCpy, setGoodPass, findGoodPass, goodPass])

	useEffect(() => {//* PUBLIC GROUP
		if (navCpy !== 2 || isConvPrivateCpy !== false || convCpy === 0)
			return

		if (!findGoodPass(convCpy))
			setGoodPass(goodPass.concat({conv_id: convCpy, passState: true, password:''}))

		const asyncFetch = async ()=>{
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})//axios create
			
			
			await axInst.post('get_group_msg', {group_conv_id: convCpy}).then(res => {
				setIsAdmin(false)
				for (let i of res.data.admin){
					if (parseInt(i.id.toString()) === logStateCpy)
						setIsAdmin(true)
				}

				if (parseInt(res.data.owner.toString()) === logStateCpy)
					setIsAdmin(true)

				let user
				const list = []

				setUserGroupList(res.data.users)//set la list des users pour savoir ou afficher dans AdminPanel
				if (res.data && res.data.messages){
					for (let i of res.data.messages){
						for (let j of res.data.users){
						if (i.sender_id === parseInt(j.id)){//prendre le bon user
							user = j
							break
						}
					}
					
					list.unshift(
						<Message
						key={i.msg_id} own={i.sender_id === logStateCpy ? true : false} sender_id={i.sender_id}
						content={i.message} username={user.username} userPP={user.pp} date={i.send_at} invite={i.invite}
						/>//mettre info du message plus bon user dans message
						)
					}
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
	}, [navCpy, refresh, logStateCpy, convCpy, setGoodPass, findGoodPass, goodPass, isConvPrivateCpy, setIsAdmin])

	useEffect(() => {//* PRIVATE GROUP
		if (navCpy !== 2 || isConvPrivateCpy !== true)
			return
		if (!findGoodPass(convCpy))
			setGoodPass(goodPass.concat({conv_id: convCpy, passState: false, password:''}))
		setPasswordPopupState(true)//si group private afficher la popup du password
		if (!findGoodPass(convCpy)?.passState)
			if (!convCpy || !requestPrivate)//l'input du password et submit
				return
			
		setRequestPrivate(false)
		const asyncFetch = async ()=>{
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})//axios create
			
			await axInst.post('get_group_secret_conv_msg', {group_conv_id: convCpy, password: passwordInput}).then(res => {
				
				setIsAdmin(false)
				for (let i of res.data.admin){
					if (parseInt(i.id.toString()) === logStateCpy)
						setIsAdmin(true)
				}

				if (parseInt(res.data.owner.toString()) === logStateCpy)
					setIsAdmin(true)

				if (!res.data){
					setGoodPass(ChangeGoodPass(convCpy, false, ''))
					return //* wrong password
				}
				setGoodPass(ChangeGoodPass(convCpy, true, passwordInput))
				setPasswordPopupState(false)//si good pass retirer le popup
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
					key={i.msg_id} own={i.sender_id === logStateCpy ? true : false} sender_id={i.sender_id}
					content={i.message} username={user.username} userPP={user.pp} date={i.send_at} invite={i.invite}
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
	}, [navCpy, refresh, logStateCpy, convCpy, requestPrivate, setPasswordPopupState, setRequestPrivate, setGoodPass,
	findGoodPass, goodPass, isConvPrivateCpy, ChangeGoodPass, passwordInput, setIsAdmin])

	const [hideRight, setHideRight] = useState(false)

	useEffect(() => {
		if (hideRight)
			props.setConv(0)
	}, [hideRight])

	let right = <ChatRight conv={props.conv} msgList={msgList}
		setRefresh={setRefresh} nav={props.nav} setConv={props.setConv}
		userGroupList={userGroupList} setRefreshConvList={props.setRefreshConvList}
		isConvPrivate={props.isConvPrivate} passwordInput={passwordInput} isAdmin={isAdmin}
		setPasswordInput={setPasswordInput} goodPass={goodPass} setHideRight={setHideRight}
	/>
	if (props.conv === 0 || !findGoodPass(convCpy)?.passState)
		right = <div className='chatBox' />

	return <React.Fragment>
		{passwordPopup}
		{right}
	</React.Fragment>
}

export default ChatBox
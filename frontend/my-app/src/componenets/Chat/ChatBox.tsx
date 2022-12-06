import axios from "axios"
import React, { useEffect, useState } from "react"
import ChatRight from "./ChatRight"
import Message from "./Message"

export type userType = {
	id:number,
	username:string,
	email:string,
	pp:string,
	providerId:string,
}

const ChatBox = (props: {conv:number, logState:number, newMsg:boolean, setNewMsg:(v:boolean)=>void, nav:number, setRefreshConvList: (v:boolean)=>void}) => {
	const newMsgCpy = props.newMsg
	const setNewMsgCpy = props.setNewMsg
	const logStateCpy = props.logState
	const convCpy = props.conv
	const [refresh, setRefresh] = useState(false)
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} username='' userPP='' date='' />])
	const navCpy = props.nav
	const request:string = props.nav === 1 ? 'get_conv_msg' : 'get_group_msg'
	const payload = props.nav === 1 ? {conv_id: convCpy} : {group_conv_id: convCpy}
	const [userGroupList, setUserGroupList] = useState<userType[]>([])


	useEffect(() =>{
		if (convCpy === 0)
			return
		const fetchMsg = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})
			
			axInst.post(request, payload).then(res => {
				const list = []

				if (navCpy === 1){
					const ownMsg = res.data.user.id === logStateCpy ? res.data.user : res.data.user2
					const otherMsg = res.data.user2.id === logStateCpy ? res.data.user2 : res.data.user
					
					for (let i of res.data.message){
						const user = i.sender_id === parseInt(ownMsg.id) ? ownMsg : otherMsg
						
						list.unshift(<Message key={i.msg_id} own={i.sender_id === logStateCpy ? true : false} content={i.message} username={user.username} userPP={user.pp} date={i.send_at}/>)
					}
				}
				else{
					let user

					setUserGroupList(res.data.users)
					console.log(res.data.users)
					for (let i of res.data.messages){
						for (let j of res.data.users){
							if (i.sender_id === parseInt(j.id)){
								user = j
								break
							}
						}
						
						list.unshift(<Message key={i.msg_id} own={i.sender_id === logStateCpy ? true : false} content={i.message} username={user.username} userPP={user.pp} date={i.send_at}/>)
					}
				}

				setMsgList(list)
			}).catch(e => {console.error(e, `error when fetch http://localhost:3000/api/message/${request}`)})

			setNewMsgCpy(false)
		}
		fetchMsg()
		setRefresh(false)
	}, [newMsgCpy, navCpy, setNewMsgCpy, logStateCpy, setMsgList, convCpy, refresh, setUserGroupList])//si conv ou newMsg

	//Faire un new useEffect avec des states groupConv et newConvMsg

	let right = <ChatRight conv={props.conv} msgList={msgList} setNewMsg={props.setNewMsg} setRefresh={setRefresh} nav={props.nav} userGroupList={userGroupList} setRefreshConvList={props.setRefreshConvList} />
	if (props.conv === 0)
		right = <div className='chatBox' />

	return <React.Fragment>{right}</React.Fragment>
}

export default ChatBox
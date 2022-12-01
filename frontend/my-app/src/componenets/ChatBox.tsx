import axios from "axios"
import React, { useEffect } from "react"
import ChatRight from "../ChatRight"
import Message from "./Message"

const ChatBox = (props: {conv: number, logState: number, newMsg:boolean, setNewMsg:(v:boolean)=>void, msgList:JSX.Element[], setMsgList:(v:JSX.Element[])=>void}) => {
	const newMsgCpy = props.newMsg
	const setNewMsgCpy = props.setNewMsg
	const logStateCpy = props.logState
	const setMsgListCpy = props.setMsgList
	const convCpy = props.conv


	useEffect(() =>{
		if (convCpy === 0)
			return
		const fetchMsg = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			console.log(convCpy)

			axInst.post('get_conv_msg',{conv_id: convCpy}).then(res => {
				console.log(res.data)
				const list = []
				for (let i of res.data.message){
					const user = i.sender_id === res.data.user.id ? res.data.user : res.data.user2
					list.unshift(<Message key={i.msg_id} own={i.sender_id === logStateCpy ? true : false} content={i.message} username={user.username} userPP={user.pp} date={i.send_at}/>)
				}
				setMsgListCpy(list)
			}).catch(e => {console.error('error when fetch http://localhost:3000/api/message/get_conv_msg')})

			setNewMsgCpy(false)
		}
		fetchMsg()
	}, [newMsgCpy, setNewMsgCpy, logStateCpy, setMsgListCpy, convCpy])//si conv ou newMsg

	//Faire un new useEffect avec des states groupConv et newConvMsg

	let right = <ChatRight conv={props.conv} msgList={props.msgList} setNewMsg={props.setNewMsg} />
	if (props.conv === 0)
		right = <div className='chatBox' />

	return <React.Fragment>{right}</React.Fragment>
}

export default ChatBox
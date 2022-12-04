import Cookies from "js-cookie";
import { useState } from "react";
import { io } from "socket.io-client"
import '../styles/Chat.scss'

type messageObj = {
	conv_id:number,
	message:string,
}

type groupMessageObj = {
	group_conv_id:number,
	message:string,
}

function ChatInput({conv_id, state, setRefresh, nav}: {conv_id:number, state: (v:boolean)=>void, setRefresh:(v:boolean)=>void, nav:number} ){
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
		socket.emit('groupMessage', payloadGroupMsg)//change payload
		setInputMessage('')
		state(true)
	}
	
	socket.on("refresh", () => {
		console.log(`refresh`);
		setRefresh(true)
	});

	return <form onSubmit={nav === 1 ? SendMessage : SendGroupMessage} className='chatInput'>
			<input placeholder="type your message..." autoFocus autoComplete="off" onChange={(e) => {setInputMessage(e.target.value)}} value={inputMessage} type="text" name="msg"/>
			<button>Send</button>
		</form>
}

export default ChatInput
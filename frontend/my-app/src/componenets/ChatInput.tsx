import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"
import {LoginStateContext} from './LoginStateContext'
import '../styles/Chat.scss'

type messageObj = {
	conv_id:number,
	message:string,
}

function ChatInput({conv_id, state, setRefresh}: {conv_id:number, state: (v:boolean)=>void, setRefresh:(v:boolean)=>void} ){
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

	const SendMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('message', payloadMsg)
		setInputMessage('')
		state(true)
	}
	
	socket.on("refresh", () => {
		console.log(`refresh`);
		setRefresh(true)
	});

	return <form onSubmit={SendMessage} className='chatInput'>
			<input placeholder="type your message..." autoFocus autoComplete="off" onChange={(e) => {setInputMessage(e.target.value)}} value={inputMessage} type="text" name="msg"/>
			<button>Send</button>
		</form>
}

export default ChatInput
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"
import {LoginStateContext} from './LoginStateContext'

type messageObj = {
	send_id:number,
	recv_id:number,
	message:string,
}

function ChatHandle(){
	
	const socket = io("localhost:3000", {
		auth: (cb) => {
			cb({
			  token: Cookies.get('jwt')
			});
		  }
	})

	const [inputMessage, setInputMessage] = useState<string>('')
	const {logState} = useContext(LoginStateContext)
	const payloadMsg: messageObj = {
		send_id: logState,
		recv_id: 667,
		message: inputMessage
	}

	const SendMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('message', payloadMsg)
		setInputMessage('')
	}
	
	useEffect(() => {
		
		socket.on("connect", () => {
			console.log(`connected : ${socket.connected}`);
		});
		
		socket.on("disconnect", () => {
			console.log(`connected : ${socket.connected}`);
		});
	}, [])

	return <div>
		<form onSubmit={SendMessage}>
			<label>Message :</label>
			<input autoFocus autoComplete="off" onChange={(e) => {setInputMessage(e.target.value)}} value={inputMessage} type="text" name="msg"/>
			<button>send</button>
		</form>
	</div>
}

export default ChatHandle
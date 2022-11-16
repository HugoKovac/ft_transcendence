import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"

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

	const [inputMessage, setInputMessage] = useState<messageObj>({
		send_id: 0,
		recv_id: 0,
		message: ''
	})

	const SendMessage = async (e: any) => {
		e.preventDefault()
		setInputMessage({...inputMessage, send_id: new Date().getTime(), recv_id: - (new Date().getTime())})
		socket.emit('message', inputMessage)
		setInputMessage({send_id: 0, recv_id: 0, message: ''})
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
			<input autoFocus autoComplete="off" onChange={(e) => {setInputMessage({...inputMessage, message: e.target.value})}} value={inputMessage.message} type="text" name="msg"/>
			<button>send</button>
		</form>
	</div>
}

export default ChatHandle
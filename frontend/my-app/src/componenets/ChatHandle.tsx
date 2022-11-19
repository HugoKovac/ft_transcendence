import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"
import {LoginStateContext} from './LoginStateContext'

// type messageObj = {
// 	send_id:number,
// 	recv_id:number,
// 	message:string,
// }

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

	const SendMessage = async (e: any) => {
		e.preventDefault()
		// setInputMessage({...inputMessage, send_id: new Date().getTime(), recv_id: - (new Date().getTime())})
		socket.emit('message', {send_id: logState,
			recv_id: 667,
			msg: inputMessage})
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
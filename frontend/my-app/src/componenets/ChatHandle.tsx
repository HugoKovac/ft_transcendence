import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { io } from "socket.io-client"
import {LoginStateContext} from './LoginStateContext'
import '../styles/Chat.scss'

type messageObj = {
	send_id:number,
	recv_id:number,
	message:string,
}

function ChatHandle({friend_id}: {friend_id:number} ){
	const {setRerender} = useContext(LoginStateContext)
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
		recv_id: friend_id,
		message: inputMessage
	}

	const SendMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('message', payloadMsg)
		setInputMessage('')
		setRerender(true)
	}
	
	// useEffect(() => {
	// 	socket.on("connect", () => {
	// 		console.log(`connected : ${socket.connected}`);
	// 	});
		
	// 	socket.on("disconnect", () => {
	// 		console.log(`connected : ${socket.connected}`);
	// 	});
	// }, [])

	return <form onSubmit={SendMessage} className='chatInput'>
			<input placeholder="type your message..." autoFocus autoComplete="off" onChange={(e) => {setInputMessage(e.target.value)}} value={inputMessage} type="text" name="msg"/>
			<button>Send</button>
		</form>
}

export default ChatHandle
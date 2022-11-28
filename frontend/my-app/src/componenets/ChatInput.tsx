import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { io } from "socket.io-client"
import {LoginStateContext} from './LoginStateContext'
import '../styles/Chat.scss'

type messageObj = {
	user_id_1:number,
	user_id_2:number,
	message:string,
}

function ChatInput({friend_id, state}: {friend_id:number, state: (v:boolean)=>void} ){
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
		user_id_1: logState,
		user_id_2: friend_id,
		message: inputMessage
	}

	const SendMessage = async (e: any) => {
		e.preventDefault()
		socket.emit('message', payloadMsg)
		setInputMessage('')
		state(true)
		console.log('yep true')
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

export default ChatInput
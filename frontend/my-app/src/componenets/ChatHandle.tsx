import { useEffect, useState } from "react";
import { io } from "socket.io-client"

type messageObj = {
	send_id:number,
	recv_id:number,
	message:string,
}

function ChatHandle(){
	const socket = io("localhost:3000")
	const [inputMessage, setInputMessage] = useState<messageObj>({
		send_id: 0,
		recv_id: 0,
		message: ''
	})

	const SendMessage = (e: any) => {
		e.preventDefault()
		setInputMessage({...inputMessage, send_id: new Date().getTime(), recv_id: - (new Date().getTime())})
		console.log(`submit : ${inputMessage}`)
		socket.emit('message', inputMessage)
	}
	
	useEffect(() => {
		
		socket.on("connect", () => {
			console.log(socket.connected); // true
		});
		
		socket.on("disconnect", () => {
			console.log(socket.connected); // false
		});
	}, [])

	return <div>
		<form onSubmit={SendMessage}>
			<label>Message :</label>
			<input onChange={(e) => {setInputMessage({...inputMessage, message: e.target.value})}} value={inputMessage.message} type="text" name="msg"/>
			<button>send</button>
		</form>
	</div>
}

export default ChatHandle
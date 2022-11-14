import { useEffect, useState } from "react";
import { io } from "socket.io-client"

type messageObj = {
	id:number,
	username:string,
	message:string,
}

function ChatHandle(){
	const socket = io("localhost:3000")
	const [inputMessage, setInputMessage] = useState<messageObj>({
		id: 0,
		username: 'default',
		message: ''
	})

	const SendMessage = (e: any) => {
		e.preventDefault()
		setInputMessage({...inputMessage, id: new Date().getTime()})
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
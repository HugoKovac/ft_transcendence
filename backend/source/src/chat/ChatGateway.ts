import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets'
import {Socket} from 'socket.io'

type messageObj = {
	id:number,
	username:string,
	message:string,
}

@WebSocketGateway({
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})
export class ChatGateway{

	@SubscribeMessage('message')
	handleMessage(@ConnectedSocket() client: Socket, @MessageBody()body: messageObj){
		console.log(`client : ${client.id} | body: ${body.id} | ${body.username} | ${body.message} `)
	}
}
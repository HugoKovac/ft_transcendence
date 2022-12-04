import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets'
import {Socket, Server} from 'socket.io'
import { ChatService } from './chat.service'

@WebSocketGateway({
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

export class ChatGateway{

	constructor(
		private readonly chatService: ChatService
	){}

	@WebSocketServer()
	serv: Server

	@SubscribeMessage('message')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody()body){
		// console.log(body)
		console.log(await this.chatService.newMsg(body, client.handshake.auth.token))
		this.serv.emit('refresh')
	}

	@SubscribeMessage('groupMessage')
	async handleGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body){
		// console.log(body)
		console.log(await this.chatService.newGroupMsg(body, client.handshake.auth.token))
		this.serv.emit('refresh')
	}
}
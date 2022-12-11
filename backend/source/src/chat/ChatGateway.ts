import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets'
import {Socket, Server} from 'socket.io'
import { ChatService } from './chat.service'
import { newGroupMsgDTO, newMsgDTO, newPrivateGroupMsgDTO } from './input.dto'

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
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newMsgDTO){
		// console.log(body)
		console.log(await this.chatService.newMsg(body, client.handshake.auth.token))
		this.serv.emit('refresh')
	}

	@SubscribeMessage('groupMessage')
	async handleGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newGroupMsgDTO){
		// console.log(body)
		console.log(await this.chatService.newGroupMsg(body, client.handshake.auth.token))
		this.serv.emit('refresh')
	}

	@SubscribeMessage('privateGroupMessage')
	async handlePrivateGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newPrivateGroupMsgDTO){
		console.log(body)
		console.log(await this.chatService.newPrivateGroupMsg(body, client.handshake.auth.token))
		this.serv.emit('refresh')
	}
}
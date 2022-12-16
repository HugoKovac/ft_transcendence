import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets'
import {Socket, Server} from 'socket.io'
import { ChatService } from './chat.service'
import { banUserDTO, newGroupMsgDTO, newMsgDTO, newPrivateGroupMsgDTO, refreshConvDTO } from './input.dto'

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
		await this.chatService.newMsg(body, client.handshake.auth.token)
		this.serv.emit(body.conv_id.toString())
	}

	@SubscribeMessage('groupMessage')
	async handleGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newGroupMsgDTO){
		console.log('groupMessage', body.message)
		await this.chatService.newGroupMsg(body, client.handshake.auth.token)
		this.serv.emit((body.group_conv_id * -1).toString())
	}
	
	@SubscribeMessage('privateGroupMessage')
	async handlePrivateGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newPrivateGroupMsgDTO){
		console.log('privateGroupMessage', body.message)
		await this.chatService.newPrivateGroupMsg(body, client.handshake.auth.token)
		this.serv.emit((body.group_conv_id * -1).toString())
	}

	@SubscribeMessage('ban')
	async ban(@MessageBody()body: banUserDTO){
		this.serv.emit(body.user_id.toString())


		setTimeout(() => {
			console.log(`unban${body.user_id.toString()}`)
			this.serv.emit(`unban${body.user_id.toString()}`)
		}, body.to * 1000)
	}

	@SubscribeMessage('refreshConv')
	async refreshConv(@MessageBody()body: refreshConvDTO){
		console.log(body.group_conv_id * -1)
		this.serv.emit((`resetConv${body.group_conv_id}`).toString())
	}

}
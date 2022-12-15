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
		console.log(body)
		await this.chatService.newMsg(body, client.handshake.auth.token)
		this.serv.emit(body.conv_id.toString())
	}

	@SubscribeMessage('groupMessage')
	async handleGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newGroupMsgDTO){
		console.log(2)
		console.log(body)
		await this.chatService.newGroupMsg(body, client.handshake.auth.token)
		this.serv.emit((body.group_conv_id * -1).toString())
	}

	@SubscribeMessage('privateGroupMessage')
	async handlePrivateGroupMessage(@ConnectedSocket() client: Socket, @MessageBody()body: newPrivateGroupMsgDTO){
		await this.chatService.newPrivateGroupMsg(body, client.handshake.auth.token)
		this.serv.emit((body.group_conv_id * -1).toString())
	}

	@SubscribeMessage('ban')
	async ban(@ConnectedSocket() client: Socket, @MessageBody()body: any){//setDTO for body
		// console.log('ban : ', body)
		/*
			listen son user id (logState cote client)
			emit au user id un ban
			setTimeout to emit unban
		*/
		this.serv.emit(body.user_id)

		console.log(`unban${body.user_id}`)

		setTimeout(() => {
			// console.log(`unban${body.user_id}`)
			this.serv.emit(`unban${body.user_id}`)
		}, body.to * 1000)
	}
}
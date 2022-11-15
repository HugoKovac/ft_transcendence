import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets'
import {Socket, Server} from 'socket.io'
import { Repository } from 'typeorm'
import { CreateMessDto } from './message.dto'
import { Message } from '../typeorm/message.entity'
import { decode } from 'jsonwebtoken'

type messageObj = {
	send_id:number,
	recv_id:number,
	message:string,
}

@WebSocketGateway({
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

export class ChatGateway{

	constructor(@InjectRepository(Message)
		private readonly messageRepo : Repository<Message>,
	){}

	@WebSocketServer()
	serv: Server

	@SubscribeMessage('message')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody()body: CreateMessDto){
		// console.log(`client : ${client.id} | body: ${body.send_id} | ${body.recv_id} | ${body.message} `)
		console.log(`client : ${client.id} | token : ${client.handshake.auth.token}`)
		console.log(decode(client.handshake.auth.token))
		const newMess = this.messageRepo.create(body)
		await this.messageRepo.save(newMess)
	}
}
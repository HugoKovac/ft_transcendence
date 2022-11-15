import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('message')
export class ChatController{
	constructor( private readonly chatService: ChatService ){}

	@Get('all')
	async allMess(){
		return await this.chatService.allMess()
	}
}
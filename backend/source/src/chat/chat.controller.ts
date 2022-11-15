import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { DeleteResult } from "typeorm";
import { ChatService } from "./chat.service";

@Controller('message')
export class ChatController{
	constructor( private readonly chatService: ChatService ){}

	@Get('all')
	async allMess(){
		return await this.chatService.allMess()
	}

	@Get('del/:id')
	async delAllMess(@Param('id', ParseIntPipe) id: number){
		return await this.chatService.delAllMess(id)
	}
}
import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DeleteResult } from "typeorm";
import { ChatService } from "./chat.service";

@Controller('message')
export class ChatController{
	constructor( private readonly chatService: ChatService ){}

	@Get('all')
	@UseGuards(AuthGuard('jwt'))

	async allMess(){
		return await this.chatService.allMess()
	}

	@Get('del/:id')
	@UseGuards(AuthGuard('jwt'))
	async delAllMess(@Param('id', ParseIntPipe) id: number){
		return await this.chatService.delAllMess(id)
	}
}
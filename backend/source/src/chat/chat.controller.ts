import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
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

	@Post('conv')
	@UseGuards(AuthGuard('jwt'))
	async getConv(@Body()bod: {user_id:number, friend_id:number}, @Req() req){
		return await this.chatService.getConv(bod, req.cookies['jwt'])
	}
}
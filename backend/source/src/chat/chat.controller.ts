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
		return await this.chatService.AllMess(id)
	}

	@Post('new_conv')
	@UseGuards(AuthGuard('jwt'))
	async newConv(@Body()bod: {user_id_1:number, user_id_2:number}, @Req() req){
		return await this.chatService.newConv(bod, req.cookies['jwt'])
	}
	
	@Post('new_msg')
	@UseGuards(AuthGuard('jwt'))
	async newMsg(@Body()bod: {user_id_1:number, user_id_2:number, message: string}, @Req() req){
		return await this.chatService.newMsg(bod, req.cookies['jwt'])
	}

	@Post('get_conv_msg')
	@UseGuards(AuthGuard('jwt'))
	async getConvMsg(@Body()bod: {user_id_1:number}, @Req() req){
		return await this.chatService.getConvMsg(bod, req.cookies['jwt'])
	}

	@Post('get_all_conv')
	@UseGuards(AuthGuard('jwt'))
	async getAllConv(@Req() req){
		return await this.chatService.getAllConv(req.cookies['jwt'])
	}
}
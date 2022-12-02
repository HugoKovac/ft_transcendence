import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./chat.service";

@Controller('message')
export class ChatController{
	constructor( private readonly chatService: ChatService ){}

	@Post('new_conv')
	@UseGuards(AuthGuard('jwt'))
	async newConv(@Body()bod: {user_id_2:number}, @Req() req){
		return await this.chatService.newConv(bod, req.cookies['jwt'])
	}
	
	@Post('new_msg')
	@UseGuards(AuthGuard('jwt'))
	async newMsg(@Body()bod: {conv_id:number, message: string}, @Req() req){
		return await this.chatService.newMsg(bod, req.cookies['jwt'])
	}

	@Post('new_group_conv')
	@UseGuards(AuthGuard('jwt'))
	async newGroupConv(@Body()bod: {user_ids:number[]}, @Req() req){
		return await this.chatService.newGroupConv(bod, req.cookies['jwt'])
	}

	@Post('get_conv_msg')
	@UseGuards(AuthGuard('jwt'))
	async getConvMsg(@Body()bod, @Req() req){
		return await this.chatService.getConvMsg(bod, req.cookies['jwt'])
	}

	@Post('get_all_conv')
	@UseGuards(AuthGuard('jwt'))
	async getAllConv(@Req() req){
		return await this.chatService.getAllConv(req.cookies['jwt'])
	}

	@Post('get_group_conv_msg')
	@UseGuards(AuthGuard('jwt'))
	async getGroupConvMsg(@Body()bod, @Req() req){
		return await this.chatService.getGroupConvMsg(bod, req.cookies['jwt'])
	}

	@Post('get_all_group_conv')
	@UseGuards(AuthGuard('jwt'))
	async getAllGroupConv(@Req() req){
		return await this.chatService.getAllGroupConv(req.cookies['jwt'])
	}
}
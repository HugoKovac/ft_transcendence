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

	@Post('new_group_msg')
	@UseGuards(AuthGuard('jwt'))
	async newGroupMsg(@Body()bod: {sender_id:number, group_conv_id:number, message: string}, @Req() req){
		return await this.chatService.newGroupMsg(bod, req.cookies['jwt'])
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

	@Post('add_user_to_group')
	@UseGuards(AuthGuard('jwt'))
	async addUserToGroup(@Body()bod){
		return await this.chatService.addUserToGroup(bod)
	}

	@Post('del_user_to_group')
	@UseGuards(AuthGuard('jwt'))
	async delUserToGroup(@Body()bod){
		return await this.chatService.delUserToGroup(bod)
	}

	@Post('change_group_name')
	async changeGroupName(@Body()bod:{group_conv_id:number, new_name:string}){
		return this.chatService.changeGroupName(bod)
	}

}
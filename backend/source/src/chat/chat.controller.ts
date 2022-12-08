import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./chat.service";
import * as DTO from './input.dto'

@Controller('message')
export class ChatController{
	constructor( private readonly chatService: ChatService ){}

	@Post('new_conv')
	@UseGuards(AuthGuard('jwt'))
	async newConv(@Body()bod: DTO.newConvDTO, @Req() req){
		return await this.chatService.newConv(bod, req.cookies['jwt'])
	}
	
	@Post('new_msg')
	@UseGuards(AuthGuard('jwt'))
	async newMsg(@Body()bod: DTO.newMsgDTO, @Req() req){
		return await this.chatService.newMsg(bod, req.cookies['jwt'])
	}

	@Post('new_group_conv')
	@UseGuards(AuthGuard('jwt'))
	async newGroupConv(@Body()bod: DTO.newGroupConvDTO, @Req() req){
		return await this.chatService.newGroupConv(bod, req.cookies['jwt'])
	}

	@Post('new_group_msg')
	@UseGuards(AuthGuard('jwt'))
	async newGroupMsg(@Body()bod: DTO.newGroupMsgDTO, @Req() req){
		return await this.chatService.newGroupMsg(bod, req.cookies['jwt'])
	}

	@Post('get_conv_msg')
	@UseGuards(AuthGuard('jwt'))
	async getConvMsg(@Body()bod: DTO.getConvMsgDTO, @Req() req){
		return await this.chatService.getConvMsg(bod, req.cookies['jwt'])
	}

	@Post('get_all_conv')
	@UseGuards(AuthGuard('jwt'))
	async getAllConv(@Req() req){
		return await this.chatService.getAllConv(req.cookies['jwt'])
	}

	@Post('get_group_msg')
	@UseGuards(AuthGuard('jwt'))
	async getGroupConvMsg(@Body()bod: DTO.getGroupConvMsgDTO, @Req() req){
		return await this.chatService.getGroupConvMsg(bod, req.cookies['jwt'])
	}

	@Post('get_all_group_conv')
	@UseGuards(AuthGuard('jwt'))
	async getAllGroupConv(@Req() req){
		return await this.chatService.getAllGroupConv(req.cookies['jwt'])
	}

	@Post('add_user_to_group')
	@UseGuards(AuthGuard('jwt'))
	async addUserToGroup(@Body()bod: DTO.addUserToGroupDTO){
		return await this.chatService.addUserToGroup(bod)
	}

	@Post('del_user_to_group')
	@UseGuards(AuthGuard('jwt'))
	async delUserToGroup(@Body()bod: DTO.delUserToGroupDTO){
		return await this.chatService.delUserToGroup(bod)
	}

	@Post('change_group_name')
	@UseGuards(AuthGuard('jwt'))
	async changeGroupName(@Body()bod: DTO.changeGroupNameDTO){
		return await this.chatService.changeGroupName(bod)
	}

	@Post('change_group_visibility')
	@UseGuards(AuthGuard('jwt'))
	async changeVisibility(@Body()bod: DTO.changeVisibilityDTO){
		console.log(bod)
		return await this.chatService.changeVisibility(bod)
	}
}
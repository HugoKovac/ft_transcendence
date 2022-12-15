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

	@Post('new_admin')
	@UseGuards(AuthGuard('jwt'))
	async newAdmin(@Body()bod: DTO.newAdminDTO, @Req() req){
		return await this.chatService.newAdmin(bod, req.cookies['jwt'])
	}

	@Post('ban_user')
	@UseGuards(AuthGuard('jwt'))
	async banUser(@Body()bod: DTO.banUserDTO, @Req() req){
		return await this.chatService.banUser(bod, req.cookies['jwt'])
	}

	@Post('del_admin')
	@UseGuards(AuthGuard('jwt'))
	async delAdmin(@Body()bod: DTO.newAdminDTO, @Req() req){
		return await this.chatService.delAdmin(bod, req.cookies['jwt'])
	}
	
	@Post('get_conv_users')
	@UseGuards(AuthGuard('jwt'))
	async getConvUsers(@Body()bod: DTO.getGroupConvMsgDTO, @Req() req){
		return await this.chatService.getConvUsers(bod, req.cookies['jwt'])
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
	async changeVisibility(@Req()req, @Body()bod: DTO.changeVisibilityDTO){
		return await this.chatService.changeVisibility(bod, req.cookies['jwt'])
	}

	@Post('group_visibility')
	@UseGuards(AuthGuard('jwt'))
	async groupVisibility(@Body()bod: DTO.groupVisibilityDTO){
		return await this.chatService.groupVisibility(bod)
	}

	@Post('set_password')
	@UseGuards(AuthGuard('jwt'))
	async setPassword(@Body()bod: DTO.setPasswordDTO, @Req() req){
		return await this.chatService.setPassword(bod, req.cookies['jwt'])
	}

	@Post('get_group_secret_conv_msg')
	@UseGuards(AuthGuard('jwt'))
	async getGroupSecretConvMsg(@Body()bod: DTO.getGroupSecretConvMsgDTO, @Req() req){
		return await this.chatService.getGroupSecretConvMsg(bod, req.cookies['jwt'])
	}

	@Post('get_conv_id')
	@UseGuards(AuthGuard('jwt'))
	async getConvId(@Req()req){
		return await this.chatService.getConvId(req.cookies['jwt'])
	}
	
}
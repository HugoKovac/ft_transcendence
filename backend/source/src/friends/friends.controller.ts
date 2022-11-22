import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FriendsService, newFriend } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService){}

	@Post('add')
	@UseGuards(AuthGuard('jwt'))
	async addFriend(@Body()bod: newFriend, @Req() req){
		return await this.friendsService.addFriend(bod, req.cookies['jwt'])
	}

	@Get('list/')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsList(@Req() req) {
		return await this.friendsService.getFriends(req.cookies['jwt'])
	}
	
	@Post('delete')
	@UseGuards(AuthGuard('jwt'))
	async delFriend(@Body()bod, @Req() req){
		return await this.friendsService.delFriend(bod, req.cookies['jwt'])
	}
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendsService, newFriend } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService){}

	@Post('add')
	@UseGuards(AuthGuard('jwt'))
	async addFriend(@Body()bod: newFriend){
		return await this.friendsService.addFriend(bod)
	}

	@Get('list/:id')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsList(@Param('id') id: number) {
		return this.friendsService.getFriends(id)
	}
}

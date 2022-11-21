import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendsService, newFriend } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService){}

	@Post('add')
	async addFriend(@Body()bod: newFriend){
		return await this.friendsService.addFriend(bod)
	}

	@Get('list/:id')
	async getFriendsList(@Param('id') id: number) {
		return this.friendsService.getFriends(id)
	}
}

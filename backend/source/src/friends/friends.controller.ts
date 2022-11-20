import { Body, Controller, Get, Post } from '@nestjs/common';
import { FriendsService, newFriend } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService){}

	@Post('add')
	async addFriend(@Body()bod: newFriend){
		return await this.friendsService.addFriend(bod)
	}
}

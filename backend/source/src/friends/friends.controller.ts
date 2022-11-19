import { Body, Controller, Get, Post } from '@nestjs/common';
import { FriendsService, newFriend } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService){}

	@Post('add')
	addFriend(@Body()bod: newFriend){
		// console.log(bod)
		return this.friendsService.findUsernameId(bod)
	}
}

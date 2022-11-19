import { Body, Controller, Get, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService){}

	@Post('add')
	addFriend(@Body()bod: any){
		console.log(bod)
	}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends, User } from 'src/typeorm';
import { Repository } from 'typeorm';

export type newFriend = {
	id: number,
	add: string
}

@Injectable()
export class FriendsService {
	constructor(@InjectRepository(Friends)
	private readonly friendsRepo: Repository<Friends>,
	@InjectRepository(User)
	private readonly userRepo: Repository<User>){}

	async findUsernameId(payload: newFriend){
		try{
			const {id} = await this.userRepo.findOne({where:{
				username: payload.add
			}})
			return id
		}catch{
			console.error(`${payload.add} don't exist`)
		}
		return 0
	}
}

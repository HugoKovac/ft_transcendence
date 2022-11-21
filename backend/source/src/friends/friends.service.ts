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

	async findUsernameId(payload: newFriend) : Promise<number>{
		try{
			const {id} : {id:number} = await this.userRepo.findOne({where:{
				username: payload.add
			}})
			return id
		}catch{
			throw (`${payload.add} don't exist`)
		}
	}

	/**
	 * Verifier si le friend
	 */
	async addFriend(payload: newFriend):  Promise<string>{//check if payload.id is same id than in jwt decoded
		try{
			const friendId: number = await this.findUsernameId(payload)
			const userEntity: User = await this.userRepo.findOne({where: {id: payload.id}, relations: ['friends']})

			for (let i of userEntity.friends){
				if (i.friend_id === friendId)
					return `${payload.add} is already your friend`
			}

			const new_friend: Friends = this.friendsRepo.create({friend_id: friendId, user: userEntity})
			await this.friendsRepo.save(new_friend)
			
			return `${payload.add} have been added`
		}
		catch(e){
			console.error(e)
			return `fail when adding ${payload.add}`
		}
	}
}

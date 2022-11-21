import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, JwtPayload } from 'jsonwebtoken';
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

	async getFriends(jwt: string): Promise<Friends[]>{//get id from jwt decoded
		const {id} = decode(jwt) as JwtPayload
		const {friends} = await this.userRepo.findOne({where: {id: id}, relations: ['friends']})
		return friends
	}

	async addFriend(payload: newFriend, jwt: string): Promise<string>{
		const {id} = decode(jwt) as JwtPayload

		if (payload.id != id)
			return 'sender id dont match your cookie'

		try{
			const friendId: number = await this.findUsernameId(payload)
			const userEntity: User = await this.userRepo.findOne({where: {id: payload.id}, relations: ['friends']})

			for (let i of userEntity.friends){
				if (i.friend_id === friendId)
					return `${payload.add} is already your friend`
			}

			const new_friend: Friends = this.friendsRepo.create({friend_id: friendId, friend_username: payload.add , user: userEntity})
			await this.friendsRepo.save(new_friend)
			
			return `${payload.add} have been added`
		}
		catch(e){
			console.error(e)
			return `fail when adding ${payload.add}`
		}
	}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, JwtPayload } from 'jsonwebtoken';
import { Friends, ReqFriend, User, BlockPeople } from 'src/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { waitForDebugger } from 'inspector';
import { unlink } from 'fs';

@Injectable()
export class ProfileService {
	constructor
    (
        @InjectRepository(User)
    	private readonly userRepo: Repository<User>,
    )
    {
    }
	async getUserData(user_id : number, target_id : number, jwt : string) : Promise<User>
	{
		let {id} = decode(jwt) as JwtPayload
		if (user_id != id)
			return undefined
		const user_one : User = await this.userRepo.findOne({where : {id : id}, relations : ['block_me']})
		if (user_one.block_me.filter((e) => e.from_id == user_id).length > 0)
			return undefined
		return await this.userRepo.findOne({where : {id : target_id}})
	}
	async uploadPp(file: Express.Multer.File, jwt : string) : Promise<string>
	{
		const {id} = decode(jwt) as JwtPayload
		const user_one : User = await this.userRepo.findOne({where : {id : id}})
		if (user_one.pp.startsWith('localhost:3000/profile-pictures/'))
			unlink("/usr/src/app/profile-pictures/" + user_one.pp.split('/').pop(), (e) => { console.log(e, " chien2")})
		user_one.pp = join('localhost:3000/profile-pictures', file.filename)
		await this.userRepo.save(user_one)

		return "Profile picture has been uploaded"
	}
	async delPp(user_id : number, jwt : string) : Promise<string>
	{
		const {id} = decode(jwt) as JwtPayload
		if (id != user_id)
		{
			console.log("c'est terminer")
			return "id don't match"
		}
		const user_one : User = await this.userRepo.findOne({where : {id : id}})
		if (user_one.pp.startsWith('localhost:3000/profile-pictures/'))
			unlink("/usr/src/app/profile-pictures/" + user_one.pp.split('/').pop(), (e) => { console.log(e, " chien")})
		user_one.pp = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKz5NrMH98NhzE4PEweSeetyBYYctrkap_d56IPqor&s"
		await this.userRepo.save(user_one)
		return "Profile picture has been deleted"
	}

	async updateUsername (user_id : number, newUsername : string, jwt : string) : Promise<string>
	{
		const {id} = decode(jwt) as JwtPayload
		if (id != user_id)
			return "id don't match"
		const user_one : User = await this.userRepo.findOne({where : {username : newUsername}})
		if (user_one)
			return "this name is already use"
		const user_bob : User = await this.userRepo.findOne({where : {id : user_id}})
		user_bob.username = newUsername
		await this.userRepo.save(user_bob)
		return "Username has been updated"
	}
}

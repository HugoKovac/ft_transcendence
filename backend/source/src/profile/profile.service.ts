import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, JwtPayload } from 'jsonwebtoken';
import { Friends, ReqFriend, User, BlockPeople, GameRanked } from 'src/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { waitForDebugger } from 'inspector';
import { unlink } from 'fs';
import { protoMatch } from './profile.controller';
@Injectable()
export class ProfileService {
	constructor
    (
        @InjectRepository(User)
    	private readonly userRepo: Repository<User>,
        @InjectRepository(GameRanked)
    	private readonly gameRankedRepo: Repository<GameRanked>,
    )
    {
    }
	async getUserData(user_id : number, target_id : number, jwt : string) : Promise<User>
	{
		let {id} = decode(jwt) as JwtPayload
		if (user_id != id)
			return undefined
		const user_one : User = await this.userRepo.findOne({where : {id : id}, relations : ['block_me']})
		if (user_one.block_me.filter((e) => e.from_id == target_id).length > 0)
			return undefined
		const return_pro = await this.userRepo.findOne({where : {id : target_id}})
		console.log("gromage => ", return_pro)
		return return_pro
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
	async moulinette_usernames(Games : GameRanked[]) : Promise<GameRanked[]>
	{
		let buffIds : {id : number, username : string}[] = []
		Games.map((e) => {
			if (e.player1Username == "" && buffIds.filter((el) => el.id == e.Player1ID).length == 0)
				buffIds.push({id : e.Player1ID, username : ""})
			if (e.player2Username == "" && buffIds.filter((el) => el.id == e.Player2ID).length == 0)
				buffIds.push({id : e.Player2ID, username : ""})
		})
		await buffIds.map(async (e) => {
			const user_one : User = await this.userRepo.findOne({where : {id : e.id}})
			if (!user_one)
				throw("Error while finding users")
			e.username = user_one.username
		})
		Games.map(async (e) => {
			if (e.player1Username == "" || e.player2Username == "")
			{
				if (e.player1Username == "")
					e.player1Username = buffIds.filter((el) => el.id == e.Player1ID)[0].username
				if (e.player2Username == "")
					e.player2Username = buffIds.filter((el) => el.id == e.Player2ID)[0].username
				await this.gameRankedRepo.save(e)
			}
		})
		return Games
	}
	async getDataGames(user_id : number, jwt : string) : Promise<protoMatch[]>
	{
		const {id} = decode(jwt) as JwtPayload
		if (id != user_id)
			return undefined
		let {Games} : User = await this.userRepo.findOne({where : {id : user_id}, relations : ['Games']})
		try {
			Games = await this.moulinette_usernames(Games)
		} catch {
			return undefined
		}
		return Games.map((e) => {
			let pop : protoMatch = {
				playerone_id : e.Player1ID,
				playertwo_id : e.Player2ID,
				playerone_score : e.Player1Score,
				playertwo_score : e.Player2Score,
				playerone_username : e.player1Username,
				playertwo_username : e.player2Username,
				date : e.Date,
				playerone_won : e.Player1Won
			}
			return pop
		})
	}

}

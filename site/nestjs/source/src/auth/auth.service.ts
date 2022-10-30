import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import {JwtService} from '@nestjs/jwt'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { CreateUserDto } from "src/users/users.dto";
import { Repository } from "typeorm";

@Injectable()
export class AuthService{
	constructor(
		private jwtService: JwtService,
		@InjectRepository(User)
		private userRepo: Repository<User>
	){}
	/*
		signIn : verifie si le user existe
		createUser : genere un user avec un paylod de ses infos
		creatToken : creer et return le token JWT en fonction su paylod du user
	*/

	async signIn(user: User){
		// console.log(user)

		if (!user)
			throw new BadRequestException()

		const {username, id, ... user_others} = user

		const repo_username = await this.userRepo.findOne({ where: { username : username} })

		if (!repo_username)
			return await this.createUser(user)

		return await this.createToken({
			username: username,
			id: id,
		})
	}

	async createUser(userDTO: CreateUserDto){
		try{
			const newUser = await this.userRepo.create(userDTO)
			console.log(newUser)
			//? add email in newUser ?
			await this.userRepo.save(newUser)
			
			return this.createToken({
				username: newUser.username,
				id: newUser.id,
			})
		}
		catch {
			throw new InternalServerErrorException()
		}
	}

	async createToken(payload){
		return await this.jwtService.sign(payload)
	}
}
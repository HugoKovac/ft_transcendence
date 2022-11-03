import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
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

	async signIn(user: User){

		if (!user)
			throw new BadRequestException()

		const {username, providerId, pp, email} = user

		const repo_username = await this.userRepo.findOne({ where: { username : username} })

		if (!repo_username)
			return await this.createUser(user)

		return await this.createToken({
			username: username,
			providerId: providerId,
			pp: pp,
			email: email,
		})
	}

	async createUser(userDTO: CreateUserDto){
		try{
			const newUser = await this.userRepo.create(userDTO)
			await this.userRepo.save(newUser)
			
			return this.createToken({
				username: newUser.username,
				providerId: newUser.providerId,
				pp: newUser.pp,
				email: newUser.email,
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
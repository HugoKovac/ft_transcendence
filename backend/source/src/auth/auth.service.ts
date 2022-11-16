import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import {JwtService} from '@nestjs/jwt'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { CreateUserDto } from "src/users/users.dto";
import { Repository } from "typeorm";
import { decode } from "jsonwebtoken";

export type userToken = {
	id: number,
	providerId: string,
	username: string,
	pp: string,
	email: string
}

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

		if (!repo_username){
			return await this.createUser(user)
		}
		
		let userDB = await this.userRepo.findOneBy({providerId: user.providerId})
		if (!userDB)
			throw new UnauthorizedException()

		return this.createToken({
			id: userDB.id,
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
				id: newUser.id,
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

	createToken(payload: userToken) :string {
		return this.jwtService.sign(payload)
	}


	async logged(inToken: string): Promise<number>{
		
		if (inToken == undefined)
			return 0

		try{
			let tokenUserInfo: any = decode(inToken)

			let user = await this.userRepo.findOneBy({providerId: tokenUserInfo.providerId})
			if (!user)
				return 0

			return tokenUserInfo.id
		}
		catch{
			return 0
		}
	}
}
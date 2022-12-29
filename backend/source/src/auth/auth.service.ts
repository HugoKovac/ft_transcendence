import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import {JwtService} from '@nestjs/jwt'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { CreateUserDto, TwoAuthDto } from "src/users/users.dto";
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

		return [this.createToken({
			id: userDB.id,
			username: username,
			providerId: providerId,
			pp: pp,
			email: email,
		}), "false"]
	}

	async createUser(userDTO: CreateUserDto){
		try{
			const newUser = this.userRepo.create(userDTO)
			await this.userRepo.save(newUser)
			
			return [this.createToken({
				id: newUser.id,
				username: newUser.username,
				providerId: newUser.providerId,
				pp: newUser.pp,
				email: newUser.email,
			}), "true"]
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

	async generate2FA(jwt:string){
		const token: any = decode(jwt)
		let qrcodeImg:string
		const speakeasy = require('speakeasy')
		const qrcode = require('qrcode')

		const user: User = await this.userRepo.findOne({where: {id: token.id}})
		if (!user)
			return undefined

		const secret = speakeasy.generateSecret({
			name: "Transcendence"
		})
		qrcode.toDataURL(secret.otpauth_url, async(err, data) => {
			qrcodeImg = data
			const new_user: User = this.userRepo.create({...user, qrCode: qrcodeImg, secret_ascii: secret.ascii})
			await this.userRepo.save(new_user)
		})
	}

	async is2FAactive(jwt:string){
		const token: any = decode(jwt)

		const {TwoAuthActive} = await this.userRepo.findOne({where: {id: token.id}})
		if (!TwoAuthActive)
			return undefined

		return TwoAuthActive
	}

	async active2FA(jwt:string){
		const token: any = decode(jwt)

		const user: User = await this.userRepo.findOne({where: {id: token.id}})
		if (!user)
			return undefined

		const new_user: User = this.userRepo.create({...user, TwoAuthActive: true})
		await this.userRepo.save(new_user)

		return true
	}

	async verify2FA({code}: TwoAuthDto, jwt:string){
		/**validate A2F. Take code in paylaod and check with user.secreta2f.verify()*/
		const token: any = decode(jwt)

		const user: User = await this.userRepo.findOne({where: {id: token.id}})
		if (!user)
			return undefined

		return require('speakeasy').totp.verify({
			secret: user.secret_ascii,
			encoding: 'ascii',
			token: code
		})
	}

	async qrcode(jwt:string){
		const token: any = decode(jwt)

		const user: User = await this.userRepo.findOne({where: {id: token.id}})
		if (!user)
			return undefined

		return user.qrCode
	}

	async isActive(jwt:string){
		const token: any = decode(jwt)

		const user: User = await this.userRepo.findOne({where: {id: token.id}})
		if (!user)
			return undefined

		return user.TwoAuthActive
	}
}
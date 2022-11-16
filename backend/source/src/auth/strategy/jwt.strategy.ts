import { Injectable, Req, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { Strategy } from 'passport-jwt'
import { User } from "src/typeorm/user.entity"
import { Repository } from "typeorm"

export type JwtPayload = {
	id: number,
	providerId: string
	username: string
	pp: string
	email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	){
		const cookieExtractor = function(req) {
			var token = null;
			if (req && req.cookies) {
				token = req.cookies['jwt'];
			}
			return token;
		};


		super({
			jwtFromRequest: cookieExtractor,
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate(payload: JwtPayload) {
		let user = await this.userRepo.findOneBy({providerId: payload.providerId})

		if (!user)
			throw new UnauthorizedException('please login')//user don't exist

		return {
			id: payload.id,
			providerId: payload.providerId,
			email: payload.email,
			pp: payload.pp,
			username: payload.username,
		}
	}
}

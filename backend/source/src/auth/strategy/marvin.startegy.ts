import { PassportStrategy } from "@nestjs/passport";
import * as Startegy from 'passport-42';
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MarvinStrategy extends PassportStrategy(Startegy, 'marvin'){
	constructor(
		configService: ConfigService,
	)
	{
		super({
			clientID: configService.get('MARVIN_APP_ID'),
			clientSecret:configService.get('MARVIN_APP_SECRET'),
			callbackURL: configService.get('MARVIN_CALLBACK_URL'),
		})
	}

	async validate(accessToken:string, refreshToken:string, profile:Startegy.Profile, cb: Startegy.VerifyCallback): Promise<any>{
		const {id, username, emails, photos} = profile

		const user = {
			provider: 'marvin',
			providerId: id,
			username: username,
			email: emails[0].value,
			pp: photos[0].value,
		}

		return cb(null, user)
	}

}
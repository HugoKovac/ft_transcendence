import { PassportStrategy } from "@nestjs/passport";
import * as Startegy from 'passport-42';
import { Injectable } from "@nestjs/common";

export const config = () => { 
	// console.log(process.env.MARVIN_APP_ID)
	// console.log(process.env.MARVIN_APP_SECRET)
	// console.log(process.env.MARVIN_CALLBACK_URL)
	return {
		clientID: process.env.MARVIN_APP_ID,
		clientSecret:process.env.MARVIN_APP_SECRET,
		callbackURL: process.env.MARVIN_CALLBACK_URL,
	}
}

@Injectable()
export class MarvinStrategy extends PassportStrategy(Startegy, 'marvin'){
	constructor()
	{
		super(config())
	}

	async validate(accessToken:string, refreshToken:string, profile:Startegy.Profile, cb: Startegy.VerifyCallback): Promise<any>{
		const {id, username, emails, photos} = profile

		// console.log(config())

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
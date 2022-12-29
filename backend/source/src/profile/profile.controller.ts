import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, UploadedFile, UseInterceptors, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { AuthService } from 'src/auth/auth.service';
import { diskStorage } from 'multer'
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { decode, JwtPayload } from 'jsonwebtoken';
import { GameRanked } from 'src/typeorm';
import { userInfo } from 'os';

export type protoMatch = {
	playerone_id : number,
	playertwo_id : number,
	playerone_score : number,
	playertwo_score : number,
	playerone_username : string,
	playertwo_username : string,
	date : Date,
	playerone_won : boolean
}

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {
	
		MulterModule.register({
		dest: '/usr/src/app/profile-pictures'
  });
	}
	@Post('getUserData')
	@UseGuards(AuthGuard('jwt'))
	async getData(@Body() bod : {user_id : number, target_id : number}, @Req() req)
	{
		return this.profileService.getUserData(bod.user_id, bod.target_id, req.cookies['jwt'])
	}

	@Post('uploadPp')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(FileInterceptor('file', {
		storage : diskStorage({
			destination :'/usr/src/app/profile-pictures',
			filename : (req, file, cb) => {
				var result           = '';
				var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				var charactersLength = characters.length;
				for ( var i = 0; i < 20; i++ ) {
					result += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				const newName : string = result + extname(file.originalname)
				cb(null, newName)
			}
		})
	}))
	async uploadFile(@UploadedFile(
    new ParseFilePipeBuilder().addMaxSizeValidator({
      maxSize: 1000000
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
	) file: Express.Multer.File, @Req() req) : Promise<string>
	{
		console.log("salut ", JSON.stringify(file, null, 2))
		const str : string = await this.profileService.uploadPp(file, req.cookies['jwt'])
		return str
	}

	@Post('delPp')
	@UseGuards(AuthGuard('jwt'))
	async deletePp(@Body() bod : {user_id : number}, @Req() req) : Promise<string>
	{
		const str : string = await this.profileService.delPp(bod.user_id, req.cookies['jwt'])
		return str
	}

	@Post('setUsername')
	@UseGuards(AuthGuard('jwt'))
	async setUsername(@Body() bod : {user_id : number,  username : string}, @Req() req) : Promise<string>
	{
		const str : string = await this.profileService.updateUsername(bod.user_id, bod.username, req.cookies['jwt'])
		return str
	}

	@Post('getDataGames')
	@UseGuards(AuthGuard('jwt'))
	async getDataGames(@Body() bod : {user_id : number}, @Req() req) : Promise<protoMatch[]>
	{
		return await this.profileService.getDataGames(bod.user_id, req.cookies['jwt'])
	}

}

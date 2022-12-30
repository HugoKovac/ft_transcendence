import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { MarvinAuthGuard } from "./guards/marvin.guards";
import { AuthService } from "./auth.service";
import { TwoAuthDto } from "src/users/users.dto";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService : AuthService) {}

	@Get('login')
	@UseGuards(MarvinAuthGuard)
	async login(mag:MarvinAuthGuard){}

	@Get()
	@Redirect('login', 301)
	Redirect(){}

	@Get('redirect')
	@UseGuards(MarvinAuthGuard)
	async returnCookie(@Res() res, @Req() req){
		const token = await this.authService.signIn(req.user)
		await res.cookie('jwt', token[0])//!Give the token if code not valid ?
		if (await this.authService.is2FAactive(token[0])){
			res.redirect(301, 'http://localhost:3002/redirect/verify_2fa')
			return
		}
		this.authService.generate2FA(token[0])
		// console.log(token, "    <----- voici")
		if (token[1] === "true")
			res.redirect(301, 'http://localhost:3002/redirect/check_token_first')
		else
			res.redirect(301, 'http://localhost:3002/redirect/check_token')
	}

	@Post('active2fa')
	async active2FA(@Req()req){
		return await this.authService.active2FA(req.cookies['jwt'])
	}

	@Post('verify2fa')
	async verify2FA(@Body()bod: TwoAuthDto, @Req()req){
		return this.authService.verify2FA(bod, req.cookies['jwt'])
	}

	@Get('logged')
	async logged(@Req() req){
		return await this.authService.logged(req.cookies['jwt'])
	}

	@Get('qrcode')
	async qrcode(@Req() req){
		return await this.authService.qrcode(req.cookies['jwt'])
	}

	@Get('is_active')
	async isActive(@Req() req){
		return await this.authService.isActive(req.cookies['jwt'])
	}
}

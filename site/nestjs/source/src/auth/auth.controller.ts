import { Controller, Get, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { MarvinAuthGuard } from "./guards/marvin.guards";
import { AuthService } from "./auth.service";
import { resolve } from "path";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService) {}

  @Get('login')
  @UseGuards(MarvinAuthGuard)
  async login(mag:MarvinAuthGuard){
	console.log(mag)
  }

  @Get()
  @Redirect('login', 301)
  Redirect(){}

  @Get('redirect')
  @UseGuards(MarvinAuthGuard)
  async redirect(@Res() res, @Req() req){
	//   console.log(req)
	// console.log(res)

	const token = await this.authService.signIn(req.user)

	await res.cookie('accessToken', token, {
		maxAge: 2592000000,
		sameSite: true,
		secure: false,
	})

	return await res.status(200).send('redirected')
  }

}

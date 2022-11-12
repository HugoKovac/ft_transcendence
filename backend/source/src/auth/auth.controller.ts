import { Controller, Get, Param, ParseIntPipe, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { MarvinAuthGuard } from "./guards/marvin.guards";
import { AuthService } from "./auth.service";

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
	await res.cookie('jwt', token)
	res.redirect(301, 'http://localhost:3002/redirect/check_token')//!set a thing to say finish for the front begin to check the validity of the cookie
}

@Get('logged')
async logged(@Req() req){
	// console.log()
	return await this.authService.logged(req.cookies['jwt'])
  }
}

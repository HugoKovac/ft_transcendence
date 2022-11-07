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
	// for (let i in res){
	// 	console.log(i)
	// 	for (let j in res[i])
	// 		console.log(` => ${j}`)
	// }
	// console.log(req.user)//marvin's payload
	const token = await this.authService.signIn(req.user)
	await res.cookie('jwt', token)
	res.redirect(301, 'http://localhost:3002')//!change to home path
}

@Get('logged')
async logged(@Req() req){
	return await this.authService.logged(req.query['Cookie'])
  }
}

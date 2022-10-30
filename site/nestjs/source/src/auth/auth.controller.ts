import { Controller, Get, Redirect, UseGuards } from "@nestjs/common";
import { MarvinAuthGuard } from "./guards/marvin.guards";

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('login')
  @UseGuards(MarvinAuthGuard)
  async login(mag:MarvinAuthGuard){
	console.log(mag)
  }

  @Get()
  @Redirect('login', 301)
  Redirect(){}

  @Get('redirect')
  redirect(res, req){
	console.log(res)
	console.log(req)
	return 'redirected'
  }

}

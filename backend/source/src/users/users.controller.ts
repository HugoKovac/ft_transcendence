import { Controller, Get, Post,
	Param, Body, UsePipes,
	ValidationPipe, ParseIntPipe,
	Delete, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import {User} from '../typeorm/user.entity'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService,
		private readonly authService: AuthService) {}//!only for debug

	@Get()//!remove for prod
	@UseGuards(AuthGuard('jwt'))
	getUser(){
		return this.usersService.findAll();
	}

	// @Post('login')//!remove if web site don't take password
	// @UsePipes(new ValidationPipe({whitelist: true}))
	// login(
	// 	@Body() LoginCreds: LoginCredsDto
	// ){
	// 	return this.usersService.login(LoginCreds);
	// }

	@Get('id/:id')//!remove for prod
	@UseGuards(AuthGuard('jwt'))
	async findUsersById(@Param('id', ParseIntPipe) id: number) {
		const user: User = await this.usersService.findbyId(id)
		if (!user)
			return {msg: 'id_not_exist'}
		return user;
	}

	@Get('delete/:id')//!guard for prod
	@UseGuards(AuthGuard('jwt'))
	async deleteUserByGet(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}

	@Post('create')//!remove if web site don't take password
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe({whitelist: true}))
		async createUser(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
		const newUser : User = await this.usersService.create(createUserDto);
		const token = await this.authService.signIn(newUser)
		await res.cookie('jwt', token)
		res.redirect(301, 'http://localhost:3002/redirect/check_token')
	}

	@Delete('id/:id')//!guard for prod
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe({whitelist: true}))
	deleteUser(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}

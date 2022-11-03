import { Controller, Get, Post,
	Param, Body, UsePipes,
	ValidationPipe, ParseIntPipe,
	Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import {User} from '../typeorm/user.entity'
import { LoginCredsDto } from './usersLoginCreds.dto';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()//!remove for prod
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
	async findUsersById(@Param('id', ParseIntPipe) id: number) {
		const user: User = await this.usersService.findbyId(id)
		if (!user)
			return {msg: 'id_not_exist'}
		return user;
	}

	@Get('delete/:id')//!guard for prod
	async deleteUserByGet(@Param('id', ParseIntPipe) id: number) {
	  return this.usersService.remove(id);
	}

	@Post('create')//!remove if web site don't take password
	@UsePipes(new ValidationPipe({whitelist: true}))
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Delete('id/:id')//!guard for prod
	@UsePipes(new ValidationPipe({whitelist: true}))
	deleteUser(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}

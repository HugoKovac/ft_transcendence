import { Controller, Get, Post,
	Param, Body, UsePipes,
	ValidationPipe, ParseIntPipe,
	Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { LoginCredsDto } from './usersLoginCreds.dto';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	getUser(){
		return this.usersService.findAll();
	}

	@Post('login')
	@UsePipes(new ValidationPipe({whitelist: true}))
	login(
		@Body() LoginCreds: LoginCredsDto
	){
		return this.usersService.login(LoginCreds);
	}

	@Get('id/:id')
	findUsersById(@Param('id', ParseIntPipe) id: number) {
	  return this.usersService.findbyId(id);
	}

	@Post('create')
	@UsePipes(new ValidationPipe({whitelist: true}))
	createUser(@Body() createUserDto: CreateUserDto) {
		console.log(createUserDto)
		return this.usersService.create(createUserDto);
	}

	@Delete('id/:id')
	@UsePipes(new ValidationPipe({whitelist: true}))
	deleteUser(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}

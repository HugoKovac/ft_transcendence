import { Controller, Get, Post,
	Param, Body, UsePipes,
	ValidationPipe, ParseIntPipe,
	Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';


@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	getUser(){
		return this.usersService.findAll();
	}

	@Get('id/:id')
	findUsersById(@Param('id', ParseIntPipe) id: number) {
	  return this.usersService.findbyId(id);
	}

	@Post('create')
	@UsePipes(ValidationPipe)
	createUser(@Body() createUserDto: CreateUserDto) {		
		return this.usersService.create(createUserDto);
	}

	@Delete('id/:id')
	deleteUser(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}

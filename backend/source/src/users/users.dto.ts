import { IsEmail, IsNotEmpty, IsNumberString } from "class-validator"

export class CreateUserDto{
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	username: string;
	
	@IsNotEmpty()
	pp: string

	@IsNotEmpty()
	providerId: string
}

export class TwoAuthDto{
	@IsNotEmpty()
	@IsNumberString()
	code: string
}
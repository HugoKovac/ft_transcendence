import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class CreateUserDto{
	@IsNotEmpty()
	@IsEmail()
	email: string;
    
	@IsNotEmpty()
    @MinLength(6)
	username: string;

	@IsNotEmpty()
    @MinLength(12)
	password: string;
}
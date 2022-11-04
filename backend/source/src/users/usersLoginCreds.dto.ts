import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginCredsDto{
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
    password: string
}
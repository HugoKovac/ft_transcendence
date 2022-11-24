import { IsNotEmpty } from "class-validator";

export class CreateMessDto{
	@IsNotEmpty()
	user_id_1: number
	
	@IsNotEmpty()
	user_id_2: number

	message: string
}
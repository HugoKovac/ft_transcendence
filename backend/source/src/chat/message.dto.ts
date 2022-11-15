import { IsNotEmpty } from "class-validator";

export class CreateMessDto{
	@IsNotEmpty()
	send_id: number
	
	@IsNotEmpty()
	recv_id: number

	message: string
}
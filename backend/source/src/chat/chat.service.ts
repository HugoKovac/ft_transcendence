import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ChatService{
	constructor(@InjectRepository(Message)
	private readonly messRepo : Repository<Message>){}

	async allMess(): Promise<Message[]>{
		return await this.messRepo.find()
	}
}
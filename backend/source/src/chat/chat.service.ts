import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/typeorm";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class ChatService{
	constructor(@InjectRepository(Message)
	private readonly messRepo : Repository<Message>){}

	async allMess(): Promise<Message[]>{
		return await this.messRepo.find()
	}

	async delAllMess(id: number) : Promise<string>{
		const result: DeleteResult = await this.messRepo.delete(id)
		return result.affected === 0 ? "Don't exist" : `message: ${id} deleted`
	}
}
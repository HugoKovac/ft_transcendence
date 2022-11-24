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

	async getConv({user_id, friend_id}: {user_id: number, friend_id: number}, jwt: string) : Promise<Message[]>{
		try{
			const conv: Message[] = await this.messRepo.find({where:{
				send_id: user_id,
				recv_id: friend_id
			}})

			return conv
		}
		catch{
			console.log(undefined)
			return undefined
		}
	}
}
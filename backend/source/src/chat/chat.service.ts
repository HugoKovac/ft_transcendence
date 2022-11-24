import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/typeorm";
import Conv from "src/typeorm/conv.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class ChatService{
	constructor(@InjectRepository(Message)
	private readonly messRepo : Repository<Message>,
	@InjectRepository(Conv)
	private readonly convRepo : Repository<Conv>){}

	async allMess(): Promise<Message[]>{
		return await this.messRepo.find()
	}

	async AllMess(id: number) : Promise<string>{
		const result: DeleteResult = await this.messRepo.delete(id)
		return result.affected === 0 ? "Don't exist" : `message: ${id} deleted`
	}

	// async getConv({user_id_1, user_id_2}: {user_id_1: number, user_id_2: number}, jwt: string) : Promise<Message[]>{
	// 	try{
	// 		const conv: Message[] = await this.messRepo.find({where:{
	// 			user_id_1: user_id_1 | user_id_2,
	// 			user_id_2: user_id_2 | user_id_1
	// 		}})

	// 		return conv
	// 	}
	// 	catch{
	// 		console.log(undefined)
	// 		return undefined
	// 	}
	// }

	async newConv({user_id_1, user_id_2}:{user_id_1:number, user_id_2:number}, jwt:string){
		try{
			const conv = await this.convRepo.findOne({where:{
				user_id_1: user_id_1 || user_id_2,
				user_id_2: user_id_2 || user_id_1
			}})

			if (!conv){
				const new_conv = this.convRepo.create({
					user_id_1: user_id_1,
					user_id_2: user_id_2 
				})

				await this.convRepo.save(new_conv)
			}

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${user_id_1}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}

	async newMsg({user_id_1, user_id_2, msg}:{user_id_1:number, user_id_2:number, msg:string}, jwt:string){
		//Check if conv exist with user_id_1 et user_id_2 en sender et receveur
		//if not exist return error
		//create new message via the entity found
		try{
			const conv = await this.convRepo.findOne({where:{
				user_id_1: user_id_1 || user_id_2,
				user_id_2: user_id_2 || user_id_1
			}})

			if (!conv)
				return 'This conv don\'t exist'
				
			const new_msg = this.messRepo.create({
				user_id_1: user_id_1,
				user_id_2: user_id_2,
				message: msg,
				conv
			})

			await this.messRepo.save(new_msg)

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${user_id_1}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}
}
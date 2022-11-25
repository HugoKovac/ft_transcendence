import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message, User } from "src/typeorm";
import Conv from "src/typeorm/conv.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class ChatService{
	constructor(@InjectRepository(Message)
	private readonly messRepo : Repository<Message>,
	@InjectRepository(Conv)
	private readonly convRepo : Repository<Conv>,
	@InjectRepository(User)
	private readonly userRepo : Repository<User>){}

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

			const user = await this.userRepo.findOne({where: {
				id: user_id_1
			}})

			if (!user)
				return false

			if (!conv){
				const new_conv = this.convRepo.create({
					user_id_1: user_id_1,
					user_id_2: user_id_2,
					user: user
				})

				await this.convRepo.save(new_conv)
			}

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${user_id_1}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}

	async newMsg({user_id_1, user_id_2, message}:{user_id_1:number, user_id_2:number, message:string}, jwt:string){
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
				message: message,
				conv
			})

			await this.messRepo.save(new_msg)

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${user_id_1}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}

	//getConv
	async getConv({user_id_1, user_id_2}:{user_id_1:number, user_id_2:number}, jwt:string){
		try{

			const conv = await this.convRepo.findOne({where:{
				user_id_1: user_id_1 || user_id_2,
				user_id_2: user_id_2 || user_id_1
			}, relations:['message']})
			
			// return 'test'
			// console.log(JSON.stringify(conv))
			return conv.message
		}
		catch{
			return false
		}
	}
}
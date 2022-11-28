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
		if (!message)
			return false
		try{
			const conv = await this.convRepo.findOne({where:{
				user_id_1: user_id_1 || user_id_2,
				user_id_2: user_id_2 || user_id_1
			}})

			if (!conv)
				return 'This conv don\'t exist'
				
			const new_msg = this.messRepo.create({
				message: message,
				sender_id: user_id_1,
				conv
			})

			await this.messRepo.save(new_msg)

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${user_id_1}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}

	async getConvMsg({user_id_1}:{user_id_1:number}, jwt:string){
		try{

			const conv = await this.convRepo.find({where:[
				{user_id_1: user_id_1},
				{user_id_2: user_id_1}
			], relations:['message']})
			
			// console.log(JSON.stringify(conv))
			return conv
		}
		catch{
			console.error(`Error when looking for user_id=${user_id_1} convs`)
			return false
		}
	}

	async getAllConv({user_id_1}:{user_id_1:number}, jwt:string){
		try{

			const conv = await this.convRepo.find({where:[
				{user_id_1: user_id_1},
				{user_id_2: user_id_1}
			]})
			
			
			let add_username = []
			for (let i of conv){
				let usr
				try{
					let {username} = await this.userRepo.findOne({where: {id: i.user_id_2}})
					usr = username
				}catch{
					usr = 'Deleted User'
				}
				console.log(add_username)
				add_username.push({...i, username: usr})
			}

			return add_username
		}
		catch{
			console.error(`Error when looking for user_id=${user_id_1} convs`)
			return false
		}
	}
}
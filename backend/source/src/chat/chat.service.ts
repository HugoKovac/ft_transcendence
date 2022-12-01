import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { decode } from "jsonwebtoken";
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

	async newConv({user_id_2}:{user_id_2:number}, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const conv = await this.convRepo.findOne({where:[
				{user_id_1: tokenUserInfo.id, user_id_2: user_id_2},
				{user_id_1: user_id_2, user_id_2: tokenUserInfo.id}]
			})

			const user = await this.userRepo.findOne({where: {
				id: tokenUserInfo.id
			}})

			const user2 = await this.userRepo.findOne({where: {
				id: user_id_2
			}})

			if (!user)
				return false

			if (!conv){
				const new_conv = this.convRepo.create({
					user_id_1: tokenUserInfo.id,
					user_id_2: user_id_2,
					user: user,
					user2: user2
				})

				await this.convRepo.save(new_conv)
			}

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${tokenUserInfo.id}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}

	async newMsg({user_id_2, message}:{user_id_2:number, message:string}, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		if (!message)
			return false
		try{
			const conv = await this.convRepo.findOne({where:[
				{user_id_1:  tokenUserInfo.id, user_id_2: user_id_2},
				{user_id_1: user_id_2, user_id_2: tokenUserInfo.id}]
			})

			if (!conv)
				return 'This conv don\'t exist'
				
			const new_msg = this.messRepo.create({
				message: message,
				sender_id: tokenUserInfo.id,
				conv
			})

			await this.messRepo.save(new_msg)

			return true
		}catch{
			console.error(`Can't find this conv with : user_id_1 {${tokenUserInfo.id}} and user_id_2 {${user_id_2}}`)
			return false
		}
	}

	async getConvMsg({conv_id}:{conv_id:number}, jwt:string){
		let tokenUserInfo: any = decode(jwt)//!verifier si la conv est bien au user_id du token

		try{

			const conv = await this.convRepo.findOne({where:{
				conv_id: conv_id
			}, relations:['message', 'user', 'user2']})

			return conv
		}
		catch{
			console.error(`Error when looking for user_id=${tokenUserInfo.id} convs`)
			return false
		}
	}

	async getAllConv(jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{

			const conv = await this.convRepo.find({where:[
				{user_id_1: tokenUserInfo.id},
				{user_id_2: tokenUserInfo.id}
			], relations:['message']})

			let rtn = conv

			for (let i in rtn)
				if (!rtn[i].message && rtn[i].user_id_1 === tokenUserInfo.id)
					delete rtn[i]
			
			let add_username = []
			for (let i of rtn){
				let usr
				let pp
				try{
					let {username, pp} = await this.userRepo.findOne({where: {id: i.user_id_2}})
					usr = username
					pp = pp
					add_username.push({...i, username: usr, pp: pp})
				}catch{
					pp = 'https://i1.sndcdn.com/avatars-000380110130-s9jvkb-t500x500.jpg'//path to deleted user's pp
					usr = 'Deleted User'
					add_username.push({...i, username: usr, pp: pp})
				}
			}

			return add_username
		}
		catch{
			console.error(`Error when looking for user_id=${tokenUserInfo.id} convs`)
			return false
		}
	}
}
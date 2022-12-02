import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { decode } from "jsonwebtoken";
import { Message, User } from "src/typeorm";
import Conv from "src/typeorm/conv.entity";
import { GroupConv } from "src/typeorm/groupConv.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService{
	constructor(@InjectRepository(Message)
	private readonly messRepo : Repository<Message>,
	@InjectRepository(Conv)
	private readonly convRepo : Repository<Conv>,
	@InjectRepository(GroupConv)
	private readonly groupConvRepo : Repository<GroupConv>,
	@InjectRepository(User)
	private readonly userRepo : Repository<User>){}

	// CONV SETTER

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

	async newMsg({conv_id, message}:{conv_id:number, message:string}, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		if (!message)
			return false
		try{
			const conv = await this.convRepo.findOne({where: {conv_id: conv_id}})

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
			console.error(`Can't find this conv with : conv_id {${conv_id}}`)
			return false
		}
	}

	// GROUP CONV SETTER

	async newGroupConv({user_ids}:{user_ids:number[]}, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const msg: Message[] = await this.messRepo.find()
			let users: User[] = []
			for (let i of user_ids){
				const user: User = await this.userRepo.findOne({where: {id: i}})
				if (user)
					users.push(user)
			}

			const newGroup = this.groupConvRepo.create({group_name: 'Test Group', messages: msg, users: users})
			
			await this.groupConvRepo.save(newGroup)

			//Check if the group conv already exist
				//exist: return false
				//don't exist: create the groupConv with all the user_ids; return true

			return true
		}catch(e){
			console.error(e)
			console.error(`Can't find this conv with : user_ids {${user_ids}}`)
			return false
		}
	}

	async newGroupMsg({conv_id, message}:{conv_id:number, message:string}, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		if (!message)
			return false
		try{
			// create the message with sender id (tokenUserInfo.id) and add it to the the groupConv
		}catch{
			console.error(`Can't find this conv with : conv_id {${conv_id}}`)
			return false
		}
	}

	// CONV GETTER

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
				let id = i.user_id_1 == tokenUserInfo.id ? i.user_id_2 : i.user_id_1
				let usr
				let pp
				try{
					let {username, pp} = await this.userRepo.findOne({where: {id: id}})
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

	// GROUP CONV GETTER

	async getGroupConvMsg({conv_id}:{conv_id:number}, jwt:string){
		let tokenUserInfo: any = decode(jwt)//!verifier si la conv est bien au user_id du token

		try{

			// return groupConv's messages and users info

		}
		catch{
			console.error(`Error when looking for user_id=${tokenUserInfo.id} convs`)
			return false
		}
	}

	async getAllGroupConv(jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{

			// Return all group conv with conv_id and infos like name and pp

		}
		catch{
			console.error(`Error when looking for user_id=${tokenUserInfo.id} convs`)
			return false
		}
	}
}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { decode } from "jsonwebtoken";
import { BanEnity, Message, MuteEntity, User } from "src/typeorm";
import Conv from "src/typeorm/conv.entity";
import { GroupConv } from "src/typeorm/groupConv.entity";
import { Repository } from "typeorm";
import * as DTO from './input.dto'
import * as bcrypt from 'bcrypt';
import { WebSocketServer } from "@nestjs/websockets";
import {Server} from 'socket.io'

@Injectable()
export class ChatService{
	constructor(@InjectRepository(Message)
	private readonly messRepo : Repository<Message>,
	@InjectRepository(Conv)
	private readonly convRepo : Repository<Conv>,
	@InjectRepository(GroupConv)
	private readonly groupConvRepo : Repository<GroupConv>,
	@InjectRepository(User)
	private readonly userRepo : Repository<User>,
	@InjectRepository(BanEnity)
	private readonly banRepo : Repository<BanEnity>,
	@InjectRepository(MuteEntity)
	private readonly muteRepo : Repository<MuteEntity>){}

	@WebSocketServer()
	serv: Server

	// CONV SETTER

	async newConv({user_id_2}:DTO.newConvDTO, jwt:string){
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

	async newMsg({conv_id, message}:DTO.newMsgDTO, jwt:string){
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

	// CONV GETTER

	async getConvMsg({conv_id}:DTO.getConvMsgDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)

		try{

			const conv = await this.convRepo.findOne({where:{
				conv_id: conv_id
			}, relations:['message', 'user', 'user2'],
			order:{
				message:{
					msg_id: 'ASC'
				}
			}})

			return conv
		}
		catch{
			console.error('Error: getConvMsg')
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
			console.error('Error: getAllConv')
			return false
		}
	}

	// GROUP CONV GETTER

	async getGroupConvMsg({group_conv_id}:DTO.getGroupConvMsgDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)

		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}, relations:['messages', 'users', 'ban_users', 'ban_users.user_banned', 'mute_users', 'mute_users.user_muted', 'admin', 'owner'], order:{messages:{msg_id: 'ASC'}}})

			if (!conv || conv.isPrivate === true)
				return false

			let kick = true
			for (let i of conv.users)
				if (i.id === tokenUserInfo.id)
					kick = false

			const date = new Date()
			for (let i of conv.ban_users){
				if ((i.user_banned.id === tokenUserInfo.id) && (i.end > date)){
					kick = true
				}
				if (i.end < date)
					await this.banRepo.delete(i.id)
			}
			
			if (kick){
				return false
			}

			for (let i of conv.mute_users)
				if ((i.user_muted.id === tokenUserInfo.id) && (i.end > date))
					await this.muteRepo.delete(i.id)

			return {...conv, password:''}
		}
		catch{
			console.error('Error: getGroupConvMsg')
			return false
		}
	}

	async getConvUsers({group_conv_id}:DTO.getGroupConvMsgDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const conv = await this.groupConvRepo.findOne({where:{group_conv_id: group_conv_id}, relations:['users', 'admin']})

			if (!conv)
				return false

			let kick = true
			let rtn = []
			for (let i of conv.users){
				if (i.id === tokenUserInfo.id)
					kick = false
				if (i.id !== tokenUserInfo.id){
					let ad = false
					for (let j of conv.admin)
						if (j.id === i.id)
							ad = true
					rtn.push({...i, admin:ad})
				}
			}

			if (kick)
				return false

			return rtn
		}
		catch(e){
			console.error(e)
		}
	}

	async getGroupSecretConvMsg({group_conv_id, password}:DTO.getGroupSecretConvMsgDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)

		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}, relations:['messages', 'users', 'admin', 'owner'], order:{messages:{msg_id: 'ASC'}}})

			if (!conv || conv.isPrivate === false)
				return

			let kick = true
			for (let i of conv.users)
				if (i.id === tokenUserInfo.id)
					kick = false

			if (!conv || kick || !await bcrypt.compare(password, conv.password))
				return false

			return {...conv, password:''}
		}
		catch{
			console.error('Error: getGroupSecretConvMsg')
			return false
		}
	}

	async getAllGroupConv(jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const convs: GroupConv[] = await this.groupConvRepo.find({relations: ['users', 'ban_users', 'ban_users.user_banned'], where: {users:{id: tokenUserInfo.id}}})

			if (!convs)
				return false

			const rtn: GroupConv[] = []

			const time = new Date()

			for (let i of convs){
				let push = true
				for (let j of i.ban_users){
					if ((j.user_banned.id === tokenUserInfo.id) && j.end > time)
						push = false
				}
				if (push)
				rtn.push(i)
			}

			return rtn
		}
		catch{
			console.error('Error: getAllGroupConv')
			return false
		}
	}

	// GROUP CONV SETTER

	async newGroupConv({user_ids, group_name}:DTO.newGroupConvDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			if (!group_name)
				return false
			let users: User[] = []
			let owner: User

			for (let i of user_ids){
				const user: User = await this.userRepo.findOne({where: {id: i}})
				if (user)
					users.push(user)
				if (user.id === tokenUserInfo.id)
					owner = user
			}

			const newGroup = this.groupConvRepo.create({group_name: group_name, users: users, owner: owner, admin: [owner]})
			
			await this.groupConvRepo.save(newGroup)

			return true
		}catch(e){
			console.error(e)
			return false
		}
	}

	async banUser({group_conv_id, user_id, to}: DTO.banUserDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const conv = await this.groupConvRepo.findOne({where:{group_conv_id:group_conv_id}, relations:['owner', 'ban_users', 'messages']})
			const user = await this.userRepo.findOne({where:{id:user_id}})

			if (!conv || conv.owner.id !== tokenUserInfo.id || !user || user_id === tokenUserInfo.id)
				return false
				
			let new_msgs = []

			for (let i of conv.messages)
				if (i.sender_id !== user_id)
					new_msgs.push(i)

			await this.groupConvRepo.save({...conv, messages: new_msgs})
			var date = new Date();
			date.setSeconds(date.getSeconds() + to);
			const new_ban: BanEnity = this.banRepo.create({from_group:conv, user_banned: user, end: date})
			await this.banRepo.save(new_ban)


			return true
				
		}catch(e){
			console.error(e)
			return false
		}
	}

	async muteUser({group_conv_id, user_id, to}: DTO.banUserDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const conv = await this.groupConvRepo.findOne({where:{group_conv_id:group_conv_id}, relations:['owner', 'mute_users', 'messages']})
			const user = await this.userRepo.findOne({where:{id:user_id}})

			if (!conv || conv.owner.id !== tokenUserInfo.id || !user || user_id === tokenUserInfo.id)
				return false

			var date = new Date();
			date.setSeconds(date.getSeconds() + to);
			const new_mute: MuteEntity = this.muteRepo.create({from_group:conv, user_muted: user, end: date})
			await this.muteRepo.save(new_mute)

			return true
		}catch(e){
			console.error(e)
			return false
		}
	}

	async newAdmin({group_conv_id, admin_ids}: DTO.newAdminDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		try{
			const conv: GroupConv = await this.groupConvRepo.findOne({where: {group_conv_id}, relations:['owner', 'admin']})
			
			if (!conv || conv.owner.id !== tokenUserInfo.id)
				return false

			let new_admin = conv.admin

			for (let i of admin_ids){
				const admin = await this.userRepo.findOne({where: {id: i}})
				if (admin)
					new_admin.push(admin)
			}

			const new_conv = this.groupConvRepo.create({...conv, admin: new_admin})
			await this.groupConvRepo.save(new_conv)

			return true
		}catch(e){
			console.error(e)
			return false
		}

	}

	async delAdmin({group_conv_id, admin_ids}: DTO.newAdminDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)

		const isInIt = (v:number) =>{
			for (let i of admin_ids){
				if (i === parseInt(v.toString()))
					return false
			}
			return true
		}

		try{
			const conv = await this.groupConvRepo.findOne({where:{group_conv_id:group_conv_id}, relations:['admin', 'owner']})

			if (!conv || conv.owner.id !== tokenUserInfo.id)
				return false

			let new_admin = []
			for (let i of conv.admin)
				if (isInIt(i.id)){
					new_admin.push(i)
				}

			const new_conv = this.groupConvRepo.create({...conv, admin: new_admin})
			await this.groupConvRepo.save(new_conv)

			return true
			
		}catch(e){
			console.error(e)
			return false
		}
	}

	async newGroupMsg({group_conv_id, message}:DTO.newGroupMsgDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		if (!message)
			return false
		try{
			const group_conv: GroupConv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}, relations: ['ban_users', 'ban_users.user_banned', 'users', 'mute_users', 'mute_users.user_muted']})

			if (!group_conv || group_conv.isPrivate)
				return false

			let kick = true
			for (let i of group_conv.users)
				if (i.id === tokenUserInfo.id){
					kick = false
				}
				
			const date = new Date()

			for (let i of group_conv.ban_users){
				if ((i.user_banned.id === tokenUserInfo.id) && (i.end > date)){
					// console.log(banEnt.end, date)
					kick = true
				}
			}

			for (let i of group_conv.mute_users){
				if ((i.user_muted.id === tokenUserInfo.id) && (i.end > date)){
					// console.log(banEnt.end, date)
					kick = true
				}
			}

			if (kick){
				return false
			}

			const newMsg = this.messRepo.create({sender_id: tokenUserInfo.id, message: message, group_conv: group_conv})
			await this.messRepo.save(newMsg)

			return true
			
		}catch(e){
			console.error(e)
			return false
		}
	}

	async newPrivateGroupMsg({group_conv_id, message, password}:DTO.newPrivateGroupMsgDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		if (!message)
			return false
		try{
			const group_conv: GroupConv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}})

			if (!group_conv || !group_conv.isPrivate)
				return false

			if (!await bcrypt.compare(password, group_conv.password))
				return false

			const newMsg = this.messRepo.create({sender_id: tokenUserInfo.id, message: message, group_conv: group_conv})
			await this.messRepo.save(newMsg)

			return true
			
		}catch(e){
			console.error(e)
			return false
		}
	}

	async addUserToGroup({group_conv_id, new_user_ids}:DTO.addUserToGroupDTO){
		if (!new_user_ids || !new_user_ids.length)
			return true
		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}, relations: ['users']})
			if (!conv)
				return false

			let users: User[] = []
			for (let i of new_user_ids){
				const user: User = await this.userRepo.findOne({where: {id: i}})
				if (user)
					users.push(user)
			}

			for (let i of conv.users)
				users.push(i)

			const newConv = this.groupConvRepo.create({...conv, users: users})
			await this.groupConvRepo.save(newConv)
			

			return true
		}
		catch(e){
			console.error(e)
			return false
		}
	}

	async delUserToGroup({group_conv_id, del_user_ids}:DTO.delUserToGroupDTO){
		if (!del_user_ids || !del_user_ids.length)
			return true
		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}, relations: ['users']})
			if (!conv)
				return false

			let users: User[] = []
			for (let i of conv.users){
				let push: boolean = true
				for (let j of del_user_ids)
					if (j == i.id)
						push = false

				if (push)
					users.push(i)
			}

			const newConv = this.groupConvRepo.create({...conv, users: users})
			await this.groupConvRepo.save(newConv)
			
			return true
		}
		catch(e){
			console.error(e)
			return false
		}
	}

	async changeGroupName({group_conv_id, new_name}:DTO.changeGroupNameDTO){
		if (!new_name)
			return true
		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}})

			const newConv = this.groupConvRepo.create({...conv, group_name: new_name})
			await this.groupConvRepo.save(newConv)

			return true
		}catch(e){
			console.error(e)
			return false
		}
	}

	async changeVisibility({group_conv_id, isPrivate}:DTO.changeVisibilityDTO, jwt:string){
		const tokenUserInfo:any = decode(jwt)
		if (isPrivate === undefined)
			return true

		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}, relations: ['users']})

			let kick = true
			for (let i of conv.users)
				if (i.id === tokenUserInfo.id)
					kick = false
			
			if (kick)
				return false

			const newConv = this.groupConvRepo.create({...conv, isPrivate: isPrivate})
			await this.groupConvRepo.save(newConv)

			return true
		}catch(e){
			console.error(e)
			return false
		}
	}

	async groupVisibility({group_conv_id}:DTO.groupVisibilityDTO){
		try{
			const conv = await this.groupConvRepo.findOne({where: {group_conv_id: group_conv_id}})

			return conv.isPrivate
		}catch(e){
			console.error(e)
			return false
		}
	}

	async setPassword({group_conv_id, password}:DTO.setPasswordDTO, jwt:string){
		let tokenUserInfo: any = decode(jwt)
		
		try{
			const conv = await this.groupConvRepo.findOne({where:{group_conv_id: group_conv_id}, relations: ['users']})
			
			let kick = true
			for (let i of conv.users)
				if (i.id === tokenUserInfo.id)
					kick = false
			
			if (kick)
				return false
			
			const salt = await bcrypt.genSalt()
			const hash = await bcrypt.hash(password, salt)

			const new_conv = this.groupConvRepo.create({...conv, password: hash})
			await this.groupConvRepo.save(new_conv)

			return true
		}catch(e){
			console.error(e)
			return false
		}
	}

	//GETTER FOR ALL

	async getConvId(jwt: string){
		let tokenUserInfo: any = decode(jwt)

		try{
			const convs = await this.convRepo.find({where: [{user_id_1: tokenUserInfo.id}, {user_id_2: tokenUserInfo.id}]})
			const group_convs = await this.groupConvRepo.find({where: {users: {id: tokenUserInfo.id}}})

			// console.log(convs)
			// console.log(group_convs)

			let ids: number[] = []
			for (let i of convs)
				ids.push(i.conv_id)
			for (let i of group_convs)
				ids.push(i.group_conv_id * -1)

			// console.log(ids)

			return ids
		}catch(e){
			console.error(e)
			return false
		}
	}
}

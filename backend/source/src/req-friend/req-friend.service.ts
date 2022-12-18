import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { send } from 'process';
import { Friends, ReqFriend, User, BlockPeople } from 'src/typeorm';
import { Repository } from 'typeorm';

export type ReqInvitFriend = {
	user_id: number,
	send_id: number
}

@Injectable()
export class ReqFriendService {
    constructor
    (
        @InjectRepository(Friends)
        private friendsRepo : Repository<Friends>,
        @InjectRepository(ReqFriend)
        private  reqfriendRepo : Repository<ReqFriend>,
        @InjectRepository(User)
    	private readonly userRepo: Repository<User>,
        @InjectRepository(BlockPeople)
    	private readonly blockpeopleRepo: Repository<BlockPeople>
    )
    {
    }
	async getFriends(jwt: string): Promise<Friends[]>{//get id from jwt decoded
		const {id} = decode(jwt) as JwtPayload
		try{
			const {friends} = await this.userRepo.findOne({where: {id: id}, relations: ['friends']})
			if (!friends)
				return undefined
			console.log(JSON.stringify(friends))
			return friends
		}catch{
			return undefined
		}
	}
    async checkUserExist(user_id : number) : Promise<User>{
		try{
			const one : User = await this.userRepo.findOne({where:{
				id : user_id
			}})
            if (one == undefined)
                throw "chien"
			return one
		}catch{

			throw (`${user_id} don't exist`)
		}
	}

    async denyInvit ({user_id, send_id} : {user_id:number, send_id: number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
           const req : ReqFriend = await this.reqfriendRepo.findOne({where : {from_id : send_id}})
            const oneUser : User = await this.userRepo.findOne({where : {id : user_id}, relations : ['recvReqFriend']})
        	if ( req == undefined || oneUser.recvReqFriend.filter(e => e.id == req.id).length <= 0)
                return `request doesn't exist`
            this.reqfriendRepo.delete({id : req.id})
            return `request ${req.id} has been deny successfully`
    }

    async acceptInvit ({user_id, send_id} : {user_id:number, send_id: number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
       try 
       {
        const req : ReqFriend = await this.reqfriendRepo.findOne({where : {id : send_id}})
        const oneUser : User = await this.userRepo.findOne({where : {id : user_id}, relations : ['recvReqFriend']})
        if ( req == undefined || oneUser.recvReqFriend.filter(e => e.id == req.id).length <= 0)
            return `request doesn't exist`
            const friend : User = await this.checkUserExist(req.from_id)
            const new_friend_one: Friends = this.friendsRepo.create({friend_id : friend.id, friend_username : friend.username, user : oneUser})
            await this.friendsRepo.save(new_friend_one)
            const new_friend_two: Friends = this.friendsRepo.create({friend_id : oneUser.id, friend_username : oneUser.username, user : friend})
            await this.friendsRepo.save(new_friend_two)
            console.log("list des req en attente : ", oneUser.recvReqFriend)
            this.reqfriendRepo.delete({id : req.id})
            console.log("after delete : ", oneUser.recvReqFriend)
            return `${user_id} and ${req.from_id} are now friends !`
        } catch {
            return `new friend doesn't exist`
       }
    }
    async sendInvit ({user_id, send_id} : {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
         if ( id != user_id)
            return "sender id dont match your cookie"
        try 
        {

            const userEntity: User = await this.userRepo.findOne({where: {id: user_id}, relations : ["friends", "recvReqFriend",  "sendReqFriend"]})
            let dest_user : User = await this.checkUserExist(send_id)
            for (let i of userEntity.friends){
                console.log(`i = `, JSON.stringify(i))
				if (i.friend_id == send_id)
					return `${send_id} is already your friend`
			}
			for (let i of userEntity.sendReqFriend){
                console.log(`i = `, JSON.stringify(i))
                await this.reqfriendRepo.delete(i)
				if (i.to_id == send_id)
					return `invitation to ${send_id} already sent`
                //userEntity.sendReqFriend.splice(userEntity.sendReqFriend.indexOf(i), 1)
			}
            //userEntity.sendReqFriend = []
			for (let req_id of userEntity.recvReqFriend){
				if (req_id.from_id == send_id)
					return await this.acceptInvit({user_id : user_id, send_id : send_id}, jwt)
			}
            const new_req: ReqFriend = this.reqfriendRepo.create({from_id : user_id, to_id : send_id, owner : userEntity, dest : dest_user})
			await this.reqfriendRepo.save(new_req)
            return "invitation has been send!"
        } catch
        {
            return `user ${send_id} doesn't exist`
        }
    }

    async getReqFriends(jwt : string) : Promise<User[]>
    {
        const {id} = decode(jwt) as JwtPayload
		try{
			const {recvReqFriend} = await this.userRepo.findOne({where: {id: id}, relations: ['recvReqFriend', 'recvReqFriend.dest']})
			if (!recvReqFriend)
				return undefined
			console.log(JSON.stringify(recvReqFriend, null, 2))
			return recvReqFriend.map(x => x.dest)
		}catch{
			return undefined
		}
    }

    async deleteFromFriendList(actual_id : number, friend_id : number) : Promise<any>
    {
        const user : User = await this.userRepo.findOne({where : {id : actual_id}, relations : ['friends']})
        let has_been_found : boolean = false
        for (let i of user.friends)
        {
            if ( i.friend_id == friend_id)
            {
                await this.friendsRepo.delete({id : i.id});
                has_been_found = true
            }
        }
        if (!has_been_found)
            throw("")    
    }

    async removeFriend({user_id, send_id} : {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
        try {
            await this.deleteFromFriendList(user_id, send_id)
            await this.deleteFromFriendList(send_id, user_id)
            return `${user_id} and ${send_id} are no longer friends ...`
        } catch {
            return `error while delete of ${user_id} and ${send_id} friendship`
        }
    }

    async blockUser({user_id, send_id} :  {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
        try {
            const userEntity: User = await this.userRepo.findOne({where: {id: user_id}, relations : ["blocked", "block_me"]})
            let dest_user : User = await this.checkUserExist(send_id)
            for (let i of userEntity.blocked){
				if (i.to_id == send_id)
					return `this user is already your blocked`
			}
            for (let i of userEntity.block_me){
				if (i.from_id == send_id)
					return `this user has blocked you before ...`
			}
            const new_req: BlockPeople = this.blockpeopleRepo.create({from_id : user_id, to_id : send_id, owner : userEntity, dest : dest_user})
			await this.blockpeopleRepo.save(new_req)
            await this.friendsRepo.delete({friend_id : send_id})
			await this.reqfriendRepo.delete({from_id : send_id, to_id : user_id})
			await this.reqfriendRepo.delete({from_id : user_id, to_id : send_id})
            return `this user has been blocked`
        } catch {
            return `error while blocking user ${send_id}`
        }
    }
    async unblockUser({user_id, send_id} :  {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
        try {
            const userEntity: User = await this.userRepo.findOne({where: {id: user_id}, relations : ["blocked", "block_me"]})
            let dest_user : User = await this.checkUserExist(send_id)
            
        	if ( userEntity == undefined || userEntity.blocked.filter(e => e.to_id == send_id).length <= 0)
                return `This user isn't blocked`
            if ( userEntity == undefined || userEntity.block_me.filter(e => e.from_id == send_id).length > 0)
                return `this user has blocked you before ...`
            const del_req: BlockPeople = userEntity.blocked.filter(e => e.to_id == send_id)[0]
			await this.blockpeopleRepo.delete({id : del_req.id})
            return `this user has been blocked`
        } catch {
            return `error while blocking user ${send_id}`
        }
    }
	async getBlockUser({user_id} :  {user_id:number}, jwt : string) : Promise<User[]>
	{
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
		{
           return null
		}
		const user_one : User = await this.userRepo.findOne({where : {id: user_id}, relations : ["blocked", "blocked.dest"]})
		if (user_one == undefined)
		{
			return null
		}
		return user_one.blocked.map(x => x.dest)
	}
	//a revoir si je veux manage les erreurs
	async getUserRelativeState({user_id, send_id} :  {user_id:number, send_id : number}, jwt : string) : Promise<string>
	{
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
		{
           return undefined
		}
		let user_one : User = await this.userRepo.findOne({where : {id: user_id}, relations : ["blocked", "friends", "sendReqFriend", "recvReqFriend", "block_me"] })
		if (user_one == undefined)
		{
			return undefined
		}
		if (user_one.recvReqFriend.filter(e => e.from_id == send_id).length > 0)
			return "recv"
		if (user_one.sendReqFriend.filter(e => e.to_id == send_id).length > 0)
			return "send"
		if (user_one.blocked.filter(e => e.to_id == send_id).length > 0)
			return "blocked"
		if (user_one.block_me.filter(e => e.from_id == send_id).length > 0)
			return "blocked_me"
		if (user_one.friends.filter(e => e.friend_id == send_id).length > 0)
			return "friend"
		return "nothing"
	}
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
			const {friends} = await this.userRepo.findOne({where: {id: id}, relations: ['friends'], })
			if (!friends)
				return undefined
			// console.log(JSON.stringify(friends))
			return friends
		}catch{
			return undefined
		}
	}
	async getFriendsAsUsers(jwt: string): Promise<User[]>{
		const {id} = decode(jwt) as JwtPayload
		try{
			const {friends} = await this.userRepo.findOne({where: {id: id}, relations: ['friends'] })
			if (!friends)
				return undefined
			// console.log(JSON.stringify(friends, null, 2))
			const listFriends : User[] = await Promise.all(friends.map(async (e) => await this.userRepo.findOne({where: {id: e.friend_id}})))
			return listFriends
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

			throw (`this user don't exist !`)
		}
	}

    async denyInvit ({user_id, send_id} : {user_id:number, send_id: number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
		if (user_id == send_id)
		   return "action impossible in yourself"
            const oneUser : User = await this.userRepo.findOne({where : {id : user_id}, relations : ['recvReqFriend']})
			let list_req_friends : ReqFriend[] = oneUser.recvReqFriend.filter((e) => e.from_id == send_id);
			if (list_req_friends.length <= 0)
				return `no invitation has been received`
			const req_id : number = list_req_friends[0].id
            await this.reqfriendRepo.delete({id : req_id})
            return `the request has been denied successfully`
    }

    async acceptInvit ({user_id, send_id} : {user_id:number, send_id: number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
		if (user_id == send_id)
		   return "action impossible in yourself"
       try 
       {
			const permission : boolean = await this.canIAdd({user_id : user_id, send_id : send_id})
			if (!permission)
				return "You can't add this user"
			const oneUser : User = await this.userRepo.findOne({where : {id : user_id}, relations : ['recvReqFriend']})
			let list_req_friends : ReqFriend[] = oneUser.recvReqFriend.filter((e) => e.from_id == send_id);
			if (list_req_friends.length <= 0)
				return `no invitation has been received`
			const req_id : number = list_req_friends[0].id
            const friend : User = await this.checkUserExist(send_id)
            const new_friend_one: Friends = this.friendsRepo.create({friend_id : friend.id, friend_username : friend.username, user : oneUser})
            await this.friendsRepo.save(new_friend_one)
            const new_friend_two: Friends = this.friendsRepo.create({friend_id : oneUser.id, friend_username : oneUser.username, user : friend})
            await this.friendsRepo.save(new_friend_two)
            // console.log("list des req en attente : ", oneUser.recvReqFriend)
            await this.reqfriendRepo.delete({id : req_id})
            // console.log("after delete : ", oneUser.recvReqFriend)
            return `a new friendship has been created !`
        } catch {
            return `Error while adding friend`
       }
    }

	async canIAdd({user_id, send_id} : {user_id:number, send_id:number}) : Promise<boolean>
	{
		const actualUser : User = await this.userRepo.findOne({where: {id : user_id}, relations : ["blocked", "block_me"]})
		if (actualUser.block_me.filter((e) => e.from_id == send_id).length > 0 ||
		actualUser.blocked.filter((e) => e.to_id == send_id).length > 0)
			return false
		return true
	}
    async sendInvitByName ({id, add} : {id : number, add : string}, jwt : string) : Promise<string>
    {
		const friendData : User = await this.userRepo.findOne({where : {username : add}})
		if (!friendData)
			return `add doesn't exist`
		return this.sendInvit({user_id : id, send_id : friendData.id}, jwt)
    }
    async sendInvit ({user_id, send_id} : {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
         if ( id != user_id)
            return "sender id dont match your cookie"
		if (user_id == send_id)
			return "action impossible in yourself"
		 try 
        {
			const permission : boolean = await this.canIAdd({user_id : user_id, send_id : send_id})
			if (!permission)
				return "cant add this user"
            const userEntity: User = await this.userRepo.findOne({where: {id: user_id}, relations : ["friends", "recvReqFriend",  "sendReqFriend"]})
            let dest_user : User = await this.checkUserExist(send_id)
            for (let i of userEntity.friends){
                // console.log(`i = `, JSON.stringify(i))
				if (i.friend_id == send_id)
					return `this user is already your friend`
			}
			for (let i of userEntity.sendReqFriend){
                // console.log(`i = `, JSON.stringify(i))
                await this.reqfriendRepo.delete(i)
				if (i.to_id == send_id)
					return `invitation to this user already sent`
			}
			for (let req_id of userEntity.recvReqFriend){
				if (req_id.from_id == send_id)
					return await this.acceptInvit({user_id : user_id, send_id : send_id}, jwt)
			}
            const new_req: ReqFriend = this.reqfriendRepo.create({from_id : user_id, to_id : send_id, owner : userEntity, dest : dest_user})
			await this.reqfriendRepo.save(new_req)
            return "invitation has been send!"
        } catch
        {
            return `error while sending an invitation to this user`
        }
    }

    async getReqFriends(jwt : string) : Promise<User[]>
    {
        const {id} = decode(jwt) as JwtPayload
		try{
			const {recvReqFriend} = await this.userRepo.findOne({where: {id: id}, relations: ['recvReqFriend', 'recvReqFriend.owner']})
			if (!recvReqFriend)
				return undefined
			// console.log(JSON.stringify(recvReqFriend, null, 2))
			return recvReqFriend.map(x => x.owner)
		}catch{
			return undefined
		}
    }

    async deleteFromFriendList(actual_id : number, friend_id : number) : Promise<any>
    {
        const user : User = await this.userRepo.findOne({where : {id : actual_id}, relations : ['friends']})
        let has_been_found : boolean = false
		// console.log ("friends : ", JSON.stringify(user.friends, null, 2))
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
		if (user_id == send_id)
		   return "action impossible in yourself"
        try {
			const req : ReqFriend = await this.reqfriendRepo.findOne({where : [{from_id : send_id, to_id : user_id}, {from_id : user_id, to_id : send_id}]})
			if (req)
			{
				await this.reqfriendRepo.delete({id : req.id})
				// console.log("req = ", JSON.stringify(req, null, 2))
				return "Invitation deleted"
			}
            await this.deleteFromFriendList(user_id, send_id)
            await this.deleteFromFriendList(send_id, user_id)
			return `You two are no longer friends ...`
		} catch {
            return `error while deleting this friendship`
        }
    }

    async blockUser({user_id, send_id} :  {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
		if (user_id == send_id)
		   return "action impossible in yourself"
        try {
			// rm friendship and req
			await this.removeFriend({user_id : user_id, send_id : send_id}, jwt)
            const userEntity: User = await this.userRepo.findOne({where: {id: user_id}, relations : ["blocked", "block_me"]})
            if (userEntity.blocked.filter((e) => e.to_id == send_id ).length > 0)
				return `this user is already blocked`
			else if (userEntity.block_me.filter((e) => {e.from_id == send_id}).length > 0)
				return `this user has blocked you before ...`
			
            let dest_user : User = await this.checkUserExist(send_id)
            const new_req: BlockPeople = this.blockpeopleRepo.create({from_id : user_id, to_id : send_id, owner : userEntity, dest : dest_user})
			await this.blockpeopleRepo.save(new_req)
            return `this user has been blocked`
        } catch {
            return `error while blocking user`
        }
    }
    async unblockUser({user_id, send_id} :  {user_id:number, send_id:number}, jwt : string) : Promise<string>
    {
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id)
           return "sender id dont match your cookie"
		if (user_id == send_id)
			return "action impossible in yourself"
        try {
            const userEntity: User = await this.userRepo.findOne({where: {id: user_id}, relations : ["blocked", "block_me"]})
            let dest_user : User = await this.checkUserExist(send_id)
            
        	if ( userEntity == undefined || userEntity.blocked.filter(e => e.to_id == send_id).length <= 0)
                return `This user isn't blocked`
            if ( userEntity == undefined || userEntity.block_me.filter(e => e.from_id == send_id).length > 0)
                return `this user has blocked you before ...`
            const del_req: BlockPeople = userEntity.blocked.filter(e => e.to_id == send_id)[0]
			await this.blockpeopleRepo.delete({id : del_req.id})
            return `this user has been unblocked`
        } catch {
            return `error while unblocking this user`
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

	//send relativeState bwtn 2 users
	async getUserRelativeState({user_id, send_id} :  {user_id:number, send_id : number}, jwt : string) : Promise<string>
	{
        let {id} = decode(jwt) as JwtPayload
        if ( id != user_id || user_id == send_id)
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
			return "block_me"
		if (user_one.friends.filter(e => e.friend_id == send_id).length > 0)
			return "friend"
		return "nothing"
	}
}
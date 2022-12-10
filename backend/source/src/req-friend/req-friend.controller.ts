import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, JwtPayload } from 'jsonwebtoken';
import { Friends, ReqFriend, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { threadId } from 'worker_threads';
import { ReqInvitFriend, RequestFriend,ReqFriendService } from './req-friend.service';

@Controller('req-friend')
export class ReqFriendController {
    constructor(private readonly ReqFriendService: ReqFriendService,
        @InjectRepository(Friends)
        private friendsRepo : Repository<Friends>,
        @InjectRepository(ReqFriend)
        private  reqfriendRepo : Repository<ReqFriend>,
        @InjectRepository(User)
    	private readonly userRepo: Repository<User>
        ){}

        @Post('sendInvit')
        @UseGuards(AuthGuard('jwt'))
        async sendInvit(@Body()bod: ReqInvitFriend, @Req() req){
            let i : string = await this.ReqFriendService.sendInvit(bod, req.cookies['jwt'])
            return i
        }
        @Post('blockUser')
        @UseGuards(AuthGuard('jwt'))
        async blockUser(@Body()bod: ReqInvitFriend, @Req() req){
            let i : string = await this.ReqFriendService.blockUser(bod, req.cookies['jwt'])
            return i
        }
        @Post('unblockUser')
        @UseGuards(AuthGuard('jwt'))
        async unblockUser(@Body()bod: ReqInvitFriend, @Req() req){
            let i : string = await this.ReqFriendService.unblockUser(bod, req.cookies['jwt'])
            return i
        }
    @Post('acceptInvit')
	@UseGuards(AuthGuard('jwt'))
	async acceptInvit(@Body()bod: RequestFriend, @Req() req){
		let i : string = await this.ReqFriendService.acceptInvit(bod, req.cookies['jwt'])
        return i
	}
    @Post('denyInvit')
	@UseGuards(AuthGuard('jwt'))
	async denyInvit(@Body()bod: RequestFriend, @Req() req){
		let i : string = await this.ReqFriendService.denyInvit(bod, req.cookies['jwt'])
        return i
	}
	@Get('list')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsList(@Req() req) {
		let str : Friends[] = await this.ReqFriendService.getFriends(req.cookies['jwt'])
        return str
	}
    @Get('list-invit')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsListInvit(@Req() req) {
		let str : ReqFriend[] = await this.ReqFriendService.getReqFriends(req.cookies['jwt'])
        return str
	}	
	@Post('delete')
	@UseGuards(AuthGuard('jwt'))
	async delFriend(@Body()bod : ReqInvitFriend, @Req() req){
		let str : string = await this.ReqFriendService.removeFriend(bod, req.cookies['jwt'])
        return str
    }

@Post("jwt")
    async PrintRepo( @Req() req) : Promise<void>
    {
        //this.reqfriendRepo.delete({id : 19})
        console.log("==========================================================================")
        console.log("jwt = ", req.cookies['jwt'])
        let {id} = decode(req.cookies['jwt']) as JwtPayload
        console.log("id = ", id)
        console.log("req : ")
        let reqs : ReqFriend[] = await this.reqfriendRepo.find({select : {
            id : true,
            from_id : true,
            to_id : true
        }})

        // for (let i of reqs)
        // {
        //     await this.reqfriendRepo.delete({id : i.id})
        // }
        console.log("req : ")
        console.log(JSON.stringify(await this.reqfriendRepo.find({select : {
            id : true,
            from_id : true,
            to_id : true
        }}), null, 2))
        console.log("friends : ")
        console.log(JSON.stringify(await this.friendsRepo.find({select : {
            id : true,
            friend_id : true,
            friend_username : true
        }}), null, 2))
        console.log("users : ")
        let yop : User[] = await this.userRepo.find({select : {
            id : true,
            username : true
        },
        relations : ['friends', "sendReqFriend", "recvReqFriend"]
    })
        console.log(JSON.stringify(yop, null, 2))
    //     for (let i of yop)
    //     {
    //         await this.userRepo.delete({id : i.id})
    //     }
    //     console.log("users : ")
    //     console.log(JSON.stringify(await this.userRepo.find({select : {
    //         id : true,
    //         username : true
    //     }})))
        console.log("==========================================================================")
    }
}

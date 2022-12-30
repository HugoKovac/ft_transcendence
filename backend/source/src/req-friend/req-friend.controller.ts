import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { decode, JwtPayload } from 'jsonwebtoken';
import { Friends, ReqFriend, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { threadId } from 'worker_threads';
import { ReqInvitFriend,ReqFriendService } from './req-friend.service';

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
        @Post('add')
        @UseGuards(AuthGuard('jwt'))
        async sendInvitByName(@Body()bod: {id : number, add : string}, @Req() req){
            let i : string = await this.ReqFriendService.sendInvitByName(bod, req.cookies['jwt'])
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
	async acceptInvit(@Body()bod: ReqInvitFriend, @Req() req){
		let i : string = await this.ReqFriendService.acceptInvit(bod, req.cookies['jwt'])
        return i
	}
    @Post('denyInvit')
	@UseGuards(AuthGuard('jwt'))
	async denyInvit(@Body()bod: ReqInvitFriend, @Req() req){
		let i : string = await this.ReqFriendService.denyInvit(bod, req.cookies['jwt'])
        return i
	}
	@Post('list-friends-as-users')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsAsUsers(@Req() req) {
		let str : User[] = await this.ReqFriendService.getFriendsAsUsers(req.cookies['jwt'])
        return str
	}
	@Post('list')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsList(@Req() req) {
		let str : Friends[] = await this.ReqFriendService.getFriends(req.cookies['jwt'])
        return str
	}
    @Post('list-invit')
	@UseGuards(AuthGuard('jwt'))
	async getFriendsListInvit(@Req() req) {
		let str : User[] = await this.ReqFriendService.getReqFriends(req.cookies['jwt'])
        return str
	}	
    @Post('list-blocked')
	@UseGuards(AuthGuard('jwt'))
	async getBlocked(@Req() req) {
		let str : User[] = await this.ReqFriendService.getBlockUser(req.cookies['jwt'])
        return str
	}	
	@Post('delete')
	@UseGuards(AuthGuard('jwt'))
	async delFriend(@Body()bod : ReqInvitFriend, @Req() req){
		let str : string = await this.ReqFriendService.removeFriend(bod, req.cookies['jwt'])
        return str
    }
	@Post('relative-state')
	@UseGuards(AuthGuard('jwt'))
	async relativeState(@Body()bod : ReqInvitFriend, @Req() req){
		let str : string = await this.ReqFriendService.getUserRelativeState(bod, req.cookies['jwt'])
        return str
    }

@Post("jwt")
    async PrintRepo( @Req() req) : Promise<void>
    {
        let {id} = decode(req.cookies['jwt']) as JwtPayload
        let reqs : ReqFriend[] = await this.reqfriendRepo.find({select : {
            id : true,
            from_id : true,
            to_id : true
        }})

        let yop : User[] = await this.userRepo.find({select : {
            id : true,
            username : true
        },
        relations : ['friends', "sendReqFriend", "recvReqFriend"]
    })
    }
}

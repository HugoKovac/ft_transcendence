import { Module } from '@nestjs/common';
import { ReqFriendService } from './req-friend.service';
import { ReqFriendController } from './req-friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends, User, ReqFriend, BlockPeople } from 'src/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Friends, User, ReqFriend, BlockPeople])],
  providers: [ReqFriendService],
  controllers: [ReqFriendController]
})
export class ReqFriendModule {}

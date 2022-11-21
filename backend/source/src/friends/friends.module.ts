import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Friends } from 'src/typeorm/friends.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
	imports: [TypeOrmModule.forFeature([Friends, User])],
	providers: [FriendsService],
	controllers: [FriendsController]
})
export class FriendsModule {}

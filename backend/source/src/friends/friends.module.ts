import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from 'src/typeorm/friends.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
	imports: [TypeOrmModule.forFeature([Friends])],
	providers: [FriendsService],
	controllers: [FriendsController]
})
export class FriendsModule {}

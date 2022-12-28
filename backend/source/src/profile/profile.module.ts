import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User, GameRanked} from 'src/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([User, GameRanked])],
	providers: [ProfileService],
	controllers: [ProfileController]
})
export class ProfileModule {}

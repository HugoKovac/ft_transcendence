import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRanked, User } from 'src/typeorm';
import { LobbyFactory } from './lobby/lobbyfactory';
import { Matchmaking } from './lobby/matchmaking';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, GameRanked])],
  providers: [PongGateway, PongService, LobbyFactory, Matchmaking]
})
export class PongModule {

}

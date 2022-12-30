import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveGame, Game, GameRanked, User } from 'src/typeorm';
import { LobbyFactory } from './lobby/lobbyfactory';
import { Matchmaking } from './lobby/matchmaking';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, GameRanked, ActiveGame, Game])],
  providers: [PongGateway, PongService, LobbyFactory, Matchmaking]
})
export class PongModule {

}

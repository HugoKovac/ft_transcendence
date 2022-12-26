import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory, GameRanked, User } from 'src/typeorm';
import { LobbyFactory } from './lobby/lobbyfactory';
import { Matchmaking } from './lobby/matchmaking';
import { PongGateway } from './pong.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, GameHistory, GameRanked])],
  providers: [PongGateway, LobbyFactory, Matchmaking]
})
export class PongModule {

}

import { Module } from '@nestjs/common';
import { LobbyFactory } from './lobby/lobbyfactory';
import { Matchmaking } from './lobby/matchmaking';
import { PongGateway } from './pong.gateway';

@Module({
  providers: [PongGateway, LobbyFactory, Matchmaking]
})
export class PongModule {

}

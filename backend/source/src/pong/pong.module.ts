import { Module } from '@nestjs/common';
import { LobbyFactory } from './lobby/lobby-factory';
import { PongGateway } from './pong.gateway';

@Module({
  providers: [PongGateway, LobbyFactory]
})
export class PongModule {

}

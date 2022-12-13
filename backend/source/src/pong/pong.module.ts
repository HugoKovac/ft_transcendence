import { Module } from '@nestjs/common';
import { LobbyFactory } from './lobby/LobbyFactory';
import { PongGateway } from './pong.gateway';

@Module({
  providers: [PongGateway, LobbyFactory]
})
export class PongModule {

}

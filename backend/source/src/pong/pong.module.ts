import { Module } from '@nestjs/common';
import { LobbyFactory } from './lobby/lobbyfactory';
import { PongGateway } from './pong.gateway';

@Module({
  providers: [PongGateway, LobbyFactory]
})
export class PongModule {

}

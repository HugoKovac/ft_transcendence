import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, WsException } from '@nestjs/websockets';
import { ClientEvents } from '../shared/client/Client.Events'
import { Server, Socket } from 'socket.io'
import { ServerEvents } from 'src/shared/server/Server.Events';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from "typeorm";
import { PongService } from 'src/pong/pong.service';
import { StatusService } from './status.service';
import { disconnect } from 'process';


@WebSocketGateway({
    namespace: 'status',
    cors:{
      origin:['http://localhost:3000'],
    },  
  }
)
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect 
{
    constructor ( private readonly statusservice: StatusService)  {}


    async handleConnection( client: Socket )
    {
      const check = await this.statusservice.checkUserID(client.handshake.query.userID as string);
      if ( !check )
      {
        console.log("user not found")
        return ;
      }
      await this.statusservice.ChangeUserStatus(check, 1, null);
      console.log(await this.statusservice.getUserStatus(check))
    }

    async handleDisconnect( client: Socket )
    {
      const check = await this.statusservice.checkUserID(client.handshake.query.userID as string);
      if ( !check )
        return ;
      await this.statusservice.ChangeUserStatus(check, 0, null);
      console.log("disconnected")
      console.log(await this.statusservice.getUserStatus(check))
    }
}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ChatGateway} from './ChatGateway'
import { Message } from "../typeorm/message.entity";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import Conv from "src/typeorm/conv.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Message, Conv])],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService]
})
export class ChatModule{}
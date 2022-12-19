import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import entities from './typeorm/index'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module';
import { config } from './auth/strategy/marvin.startegy';
import { FriendsModule } from './friends/friends.module';
import { PongModule } from './pong/pong.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
	ConfigModule.forRoot({isGlobal: true, load: [config]}),
	ScheduleModule.forRoot(),
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => {
			// console.log(configService.get('DB_HOST'))
			// console.log(configService.get('DB_PORT') as number)
			// console.log(configService.get('DB_USERNAME'))
			// console.log(configService.get('DB_PASSWORD'))
			// console.log(configService.get('DB_NAME'))
			return {
			type: 'postgres',
			host: configService.get('DB_HOST'),
			port: configService.get('DB_PORT') as number,
			username: configService.get('DB_USERNAME'),
			password: configService.get('DB_PASSWORD'),
			database: configService.get('DB_NAME'),
			entities: entities,
			synchronize: true,
		}},
		inject: [ConfigService],
	}),
	UsersModule,
	AuthModule,
	ChatModule,
	FriendsModule,
	PongModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

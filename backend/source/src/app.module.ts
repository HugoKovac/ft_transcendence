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

@Module({
  imports: [
	ConfigModule.forRoot({isGlobal: true, load: [config]}),
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => ({
			type: 'postgres',
			host: configService.get('DB_HOST'),
			port: configService.get('DB_PORT') as number,
			username: configService.get('DB_USERNAME'),
			password: configService.get('DB_PASSWORD'),
			database: configService.get('DB_NAME'),
			entities: entities,
			synchronize: true,
		}),
		inject: [ConfigService],
	}),
	UsersModule,
	AuthModule,
	ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

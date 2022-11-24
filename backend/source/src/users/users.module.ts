import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/index';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
	JwtModule.registerAsync({
		imports: [ConfigModule],
		useFactory: async (configService: ConfigService) => ({
			secret:  configService.get('JWT_SECRET'),
		}),
		inject: [ConfigService],
	})],//!JWT Module only for debug
  controllers: [UsersController],
  providers: [UsersService,
	AuthService, JwtStrategy]//!only for debug
})
export class UsersModule {}

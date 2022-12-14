import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller'
import { MarvinStrategy } from "./strategy/marvin.startegy";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategy/jwt.strategy";


@Module({
	imports: [ConfigModule,
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret:  configService.get('JWT_SECRET'),
            }),
			inject: [ConfigService],
        }),
	],
	providers: [MarvinStrategy, AuthService, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule{}
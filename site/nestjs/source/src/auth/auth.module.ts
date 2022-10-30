import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller'
import { MarvinStrategy } from "./strategy/marvin.startegy";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
	providers: [MarvinStrategy, AuthService],
	controllers: [AuthController],
	imports: [TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret:  configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRE'),
                },
            }),
			inject: [ConfigService],
        }),
	],
})
export class AuthModule{}
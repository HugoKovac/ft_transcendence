import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller'
import { MarvinStrategy } from "./strategy/marvin.startegy";


@Module({
	providers: [MarvinStrategy],
	controllers: [AuthController],
	imports: [],
})
export class AuthModule{}
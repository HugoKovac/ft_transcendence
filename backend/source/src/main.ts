import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
	}))
	app.setGlobalPrefix('api');
	app.use(cookieParser());
	app.enableCors({origin: true, credentials: true,});
	await app.listen(3000);
}
bootstrap();

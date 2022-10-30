import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
//   app.get('/api/auth/login', passport.authenticate('42'));
  await app.listen(3000);
}
bootstrap();

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
	constructor(private readonly configService: ConfigService) {}

  getHello(): string {
	console.log(this.configService.get('DB_HOST'))
	console.log(this.configService.get('DB_PORT')as number)
	console.log(this.configService.get('DB_NAME'))
	console.log(this.configService.get('DB_USERNAME'))
	console.log(this.configService.get('DB_PASSWORD'))
    return 'Hello World!';
  }
}

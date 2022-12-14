import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { StatusGateway } from './status.gateway';
import { StatusService } from './status.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [StatusGateway, StatusService],
})
export class StatusModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(@InjectRepository(Friends)FriendsRepo: Repository<Friends>){
		
	}
}

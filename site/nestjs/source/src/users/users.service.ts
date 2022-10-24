import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import {User} from '../typeorm/user.entity'
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) { }

	create(createUserDto: CreateUserDto){
		const newUser = this.usersRepository.create(createUserDto);
		this.usersRepository.save(newUser)
	}

	findAll() : Promise<User[]>{ 
		return this.usersRepository.find();
	}
	
	findbyId(id: number) : Promise<User> {
		return this.usersRepository.findOneBy({id});
	}

	async remove(id: number): Promise<void>{
		await this.usersRepository.delete(id)
	}
}

import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import {User} from '../typeorm/user.entity'
import { CreateUserDto } from './users.dto';
import { decode, JwtPayload } from 'jsonwebtoken';



@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) { }

	async create(createUserDto: CreateUserDto){
		const newUser = this.usersRepository.create(createUserDto);

		// newUser.salt = await bcrypt.genSalt();
		// newUser.password = await bcrypt.hashSync(newUser.password, newUser.salt)

		await this.usersRepository.save(newUser)
		return newUser
	}

	async findAll() : Promise<User[]>{ 
		let rtn: User[] = await this.usersRepository.find()
		return rtn
	}
	
	async findbyId(id: number) : Promise<User> {
		let rtn: User = await this.usersRepository.findOneBy({id});

		return rtn
	}


	async remove(id: number) : Promise<string>{
		const result: DeleteResult = await this.usersRepository.delete(id)
		return result.affected === 0 ? "Don't exist" : `user: ${id} deleted`
	}

	// async login(LoginCreds: LoginCredsDto): Promise<Partial<User>>{
	// 	const {email, password} = LoginCreds
	// 	let usr: User = await this.usersRepository.findOneBy({email})
	// 	if (!usr)
	// 		throw new NotFoundException('Login or password not found')
	// 	const hashedPassword = await bcrypt.hash(password, usr.salt)
	// 	if (hashedPassword === usr.password){
	// 		return {username: usr.username,
	// 			email: usr.email}
	// 	}
	// 	throw new NotFoundException('Login or password not found')
	// }



}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity()
class Conv{
	@PrimaryGeneratedColumn()
	conv_id: number

	@Column({
		nullable: false,
	})
	user_id_1: number

	@Column({
		nullable: false,
	})
	user_id_2: number

	@ManyToOne(
		() => User,
		user => user.conv
	)
	@JoinColumn({
		name: 'userId'
	})
	user: User

	@ManyToOne(
		() => User,
		user => user.conv
	)
	@JoinColumn({
		name: 'userId2'
	})
	user2: User

	@OneToMany(
		() => Message,
		message => message.conv
	)
	@JoinColumn({
		name: 'message_list'
	})
	message: Message[]
}

export default Conv
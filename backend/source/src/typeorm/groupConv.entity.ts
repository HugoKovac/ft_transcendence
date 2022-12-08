import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity()
export class GroupConv{
	@PrimaryGeneratedColumn()
	group_conv_id:number

	@Column({
		nullable: false,
		type: 'varchar',
		default: ''
	})
	group_name: string

	@Column({
		default: false
	})
	isPrivate: boolean

	@OneToMany(
		() => Message,
		message => message.group_conv
	)
	@JoinColumn({
		name: 'messages_list'
	})
	messages: Message[]

	@ManyToMany(
		() => User,
		user => user.group_conv
	)
	@JoinTable({
		name: 'users_list'
	})
	users: User[]

	@Column({
		nullable: false,
		type: 'varchar',
		default: ''
	})
	password: string
}
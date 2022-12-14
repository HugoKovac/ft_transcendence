import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BanEnity } from "./ban.entity";
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
		name: 'users_list',
		joinColumn: {
			name: 'users'
		},
		inverseJoinColumn: {
			name: 'group_conv'
		}
	})
	users: User[]

	@Column({
		nullable: false,
		type: 'varchar',
		default: '',
	})
	password: string

	@ManyToOne(
		() => User,
		user => user.own_group
	)
	owner: User

	@ManyToMany(
		() => User,
		user => user.admin_group
	)
	@JoinTable({
		name: 'admin'
	})
	admin: User[]

	@OneToMany(
		() => BanEnity,
		ban => ban.from_group
	)
	ban_users: BanEnity[]
}
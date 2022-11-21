import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Friends{
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: number;

	@Column({
		type: 'bigint',
	})
	friend_id: number

	@ManyToOne(
		() => User,
		user => user.friends
	)
	@JoinColumn({
		name: 'userId'
	})
	user: User
}

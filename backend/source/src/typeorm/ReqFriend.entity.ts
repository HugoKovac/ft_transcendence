import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ReqFriend{
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: number;

	@Index()
	@Column({
		type: 'bigint',
	})
	from_id: number;

	@Index()
	@Column({
		type : 'bigint'
	})
	to_id: number;

	@ManyToOne(
		() => User,
		user => user.sendReqFriend
	)
	owner: User;
	
	@ManyToOne(
		() => User,
		user => user.recvReqFriend
	)
	dest: User;

	@CreateDateColumn()
	created: Date;
}

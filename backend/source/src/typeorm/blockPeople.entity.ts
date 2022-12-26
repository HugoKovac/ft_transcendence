import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class BlockPeople{
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
		user => user.blocked
	)
	owner: User;
	
	@ManyToOne(
		() => User,
		user => user.block_me
	)
	dest: User;

	@CreateDateColumn()
	created: Date;
}
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Conv from "./conv.entity";

@Entity()
export class Message{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'msg_id'
	})
	msg_id: number

	@Column({
		type: 'bigint',
		nullable: false,
	})
	user_id_1: number

	@Column({
		type: 'bigint',
		nullable: false,
	})
	user_id_2: number

	@Column({
		nullable: false,
		default: '',
		type: 'varchar'
	})
	message: string

	@CreateDateColumn()
	send_at: Date

	@ManyToOne(
		() => Conv,
		conv => conv.message
	)
	@JoinColumn({
		name: 'conv'
	})
	conv: Conv
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'msg_id'
	})
	msg_id: number

	@Column({
		type: 'bigint',
	})
	send_id: number

	@Column({
		type: 'bigint',
	})
	recv_id: number

	@Column({
		nullable: false,
		default: '',
		type: 'varchar'
	})
	message: string

	@CreateDateColumn()
	send_at: Date
}

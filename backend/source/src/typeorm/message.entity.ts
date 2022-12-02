import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Conv from "./conv.entity";
import { GroupConv } from "./groupConv.entity";

@Entity()
export class Message{
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'msg_id'
	})
	msg_id: number

	@Column()
	sender_id: number;

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

	@ManyToOne(
		() => GroupConv,
		group_conv => group_conv.messages
	)
	@JoinColumn({
		name: 'group_conv'
	})
	group_conv: GroupConv
}

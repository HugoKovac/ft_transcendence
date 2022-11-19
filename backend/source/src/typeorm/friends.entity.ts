import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Friends{
	@PrimaryColumn({
		type: 'bigint',
	})
	user_id: number

	@Column({
		type: 'bigint',
		array: true
	})
	friend_list: number[]
}
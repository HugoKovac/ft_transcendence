import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupConv } from "./groupConv.entity";
import { User } from "./user.entity";

@Entity()
export class MuteEntity{
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(
		() => User,
		user => user.mute_groups
	)
	user_muted: User

	@ManyToOne(
		() => GroupConv,
		group => group.mute_users,
	)
	from_group: GroupConv

	@Column({
		nullable: false,
		default: new Date()
	})
	end: Date
}
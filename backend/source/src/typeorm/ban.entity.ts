import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupConv } from "./groupConv.entity";
import { User } from "./user.entity";

@Entity()
export class BanEnity{
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(
		() => User,
		user => user.ban_groups
	)
	user_banned: User

	@ManyToOne(
		() => GroupConv,
		group => group.ban_users,
	)
	from_group: GroupConv

	@Column({
		nullable: false,
		default: new Date()
	})
	end: Date
}
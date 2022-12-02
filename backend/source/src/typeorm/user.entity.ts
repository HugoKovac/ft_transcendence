import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import Conv from "./conv.entity";
import { Friends } from "./friends.entity";
import { GroupConv } from "./groupConv.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'user_id',
	})
	id: number;

	@Column({
        nullable: false,
		default: '',
	})
	username: string;

    @Column({
        name: 'email',
		nullable: false,
        default: '',
	})
	email: string;

	@Column({
        nullable: false,
        default: '',
    })
	pp: string

	@Column({
        nullable: false,
        default: '',
    })
	providerId: string

	@OneToMany(
		() => Friends,
		friends => friends.user
	)
	@JoinColumn({
		name: 'friend_list'
	})
	friends: Friends[]

	@OneToMany(
		() => Conv,
		conv => conv.user
	)
	@JoinColumn({
		name: 'conv_list'
	})
	conv: Conv[]

	@ManyToMany(
		() => GroupConv,
		group_conv => group_conv.users
	)
	group_conv: GroupConv[]
}

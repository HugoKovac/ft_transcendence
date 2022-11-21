import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Friends } from "./friends.entity";

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
}

import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { BanEnity } from "./ban.entity";
import Conv from "./conv.entity";
import { Friends } from "./friends.entity";
import { GroupConv } from "./groupConv.entity";
import { MuteEntity } from "./mute.entity";
import { BlockPeople } from "./blockPeople.entity"
import { ReqFriend } from "./ReqFriend.entity";
import { GameRanked } from "./gameranked.entity";
import { ActiveGame } from "./activegame.entity";

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
	pp: string;

	@Column({
        nullable: false,
        default: '',
    })
	providerId: string;

	@OneToMany(
		() => Friends,
		friends => friends.user
	)
	@JoinColumn({
		name: 'friend_list'
	})
	friends: Friends[];
	@OneToMany(
		() => ReqFriend,
		reqFriend => reqFriend.owner
	)
	@JoinColumn({
		name: 'request_friend_list'
	})
	sendReqFriend: ReqFriend[];
	
	@OneToMany(
		() => BlockPeople,
		blockPeople => blockPeople.dest
	)
	@JoinColumn({
		name: 'block_me'
	})
	block_me: BlockPeople[];

	@OneToMany(
		() => BlockPeople,
		blockPeople => blockPeople.owner
	)
	@JoinColumn({
		name: 'blocked'
	})
	blocked: BlockPeople[];
	
	@OneToMany(
		() => ReqFriend,
		reqFriend => reqFriend.dest
	)
	@JoinColumn({
		name: 'wait_request_friend_list'
	})
	recvReqFriend: ReqFriend[];

	@OneToMany(
		() => Conv,
		conv => conv.user
	)
	@JoinColumn({
		name: 'conv_list'
	})
	conv: Conv[];

	@ManyToMany(
		() => GroupConv,
		group_conv => group_conv.users
	)
	group_conv: GroupConv[]

	@OneToMany(
		() => GroupConv,
		group_conv => group_conv.owner
	)
	own_group: GroupConv[]

	@ManyToMany(
		() => GroupConv,
		group_conv => group_conv.admin
	)
	admin_group: GroupConv[]

	@OneToMany(
		() => BanEnity,
		ban => ban.user_banned
	)
	ban_groups: BanEnity[]

	@OneToMany(
		() => MuteEntity,
		ban => ban.user_muted
	)
	mute_groups: MuteEntity[]

	@Column({
		default: false
	})
	TwoAuthActive: boolean

	@Column({
		default: ''
	})
	qrCode: string

	@Column({
		default: ''
	})
	secret_ascii: string

	@Column( { type:'bigint', default: 0 })
	GameVictory: number;

	@Column( { type:'bigint', default: 0 })
	GameDefeat: number;

	@ManyToMany( () => GameRanked, games => games.User )
	@JoinTable()
	Games: GameRanked[]

	@Column({ default: 0 })
	status: number
    
    @Column( { nullable: true } )
    LobbyID : string
}
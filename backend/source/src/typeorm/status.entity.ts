import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class StatusEntity
{
    @PrimaryGeneratedColumn()
    id: number;
    
    //? User Status, 0 = Offline, 1 = Online, 2, InGame with a gameID
	@Column({ default: 0 })
	CurrentStatus: number
    
    @Column( { nullable: true } )
    LobbyID : string

    @OneToOne( () => User, user => user.Status)
    @JoinColumn({
		name: 'userId'
	})
    user: User
}
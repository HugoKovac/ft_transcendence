import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class GameRanked
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Player1ID : number;

    @Column()
    Player2ID : number;

    @Column()
    Player1Score: number;

    @Column()
    Player2Score: number;

    @Column({default: false})
    Player1Won: boolean;

    @Column({ default: false })
    Player2Won: boolean;

    @Column()
    GameEndReason: string;

    @Column({ nullable: false, default: new Date() })
    Date : Date;

    @ManyToMany( () => User, user => user.Games)
    @JoinColumn({
		name: 'userId'
	})
    User: User[]
}
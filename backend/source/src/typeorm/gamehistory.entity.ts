import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


//? TypeORM basically convert a class into a database table.

@Entity()
export class GameHistory
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

    @Column({ default: new Date() })
    Date : Date;

    @ManyToOne(
        () => User,
        user => user.match_history
    )
    user_owner: User
}
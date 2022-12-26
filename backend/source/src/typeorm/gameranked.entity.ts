import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameHistory } from "./gamehistory.entity";


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

    @Column()
    GameEndReason: string;

    @Column({ default: new Date() })
    Date : Date;

    @ManyToOne( () => GameHistory, history => history.Games)
    Stats: GameHistory
}
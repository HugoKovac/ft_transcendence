import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ActiveGame } from "./activegame.entity";
import { User } from "./user.entity";


@Entity()
export class Game
{
    @PrimaryGeneratedColumn({})
    id: number;

    @Column()
    Player1ID : number;

    @Column()
    Player2ID : number;

    @Column()
    LobbyID : string

    @ManyToOne(() => ActiveGame, activegame => activegame.Games)
    activegame: ActiveGame;
}
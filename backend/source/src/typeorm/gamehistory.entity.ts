import { Entity, OneToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameRanked } from "./gameranked.entity";
import { User } from "./user.entity";


//? TypeORM basically convert a class into a database table.

@Entity()
export class GameHistory
{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany( () => GameRanked, games => games.Stats )
    Games: GameRanked[]

    @OneToOne(
        () => User,
        user => user.match_history
    )
    user_owner: User
}
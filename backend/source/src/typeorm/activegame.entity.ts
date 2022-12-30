import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Game } from "./game.entity";
import { User } from "./user.entity";


@Entity()
export class ActiveGame
{
    @PrimaryColumn({
        nullable: false,
        default: 1
    })
    id: number;

    @OneToMany(() => Game, game => game.activegame)
    Games: Game[];
}
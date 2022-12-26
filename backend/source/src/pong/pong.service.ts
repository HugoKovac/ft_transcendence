import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, GameHistory, GameRanked } from 'src/typeorm';
import { Repository } from "typeorm";

@Injectable()
export class PongService
{
    constructor( @InjectRepository(User) private userRepo: Repository<User>,
                 @InjectRepository(GameHistory) private GamehistoryRepo: Repository<GameHistory>,
                 @InjectRepository(GameRanked) private GamerankedRepo: Repository<GameRanked> ) {}
}
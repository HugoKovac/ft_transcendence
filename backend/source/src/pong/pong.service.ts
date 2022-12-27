import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, GameRanked } from 'src/typeorm';
import { Repository } from "typeorm";
import { RankedGameData } from "./types";

@Injectable()
export class PongService
{
    constructor( @InjectRepository(User) private userRepo: Repository<User>,
                 @InjectRepository(GameRanked) private gamerankedRepo: Repository<GameRanked> ) {}


    
    async incrementeUserVictory( WinnerID: string ) : Promise<string>
    {
        try 
        {
            let winnerid : any = WinnerID;

            const winnerEntity: User = await this.userRepo.findOne({where: {id: winnerid}});
            if ( !winnerEntity )
                return "User not found";
            
            winnerEntity.GameVictory++;
            await this.userRepo.save(winnerEntity);

            return `Successfully given victory to ${WinnerID}`
        }
        catch(error)
        {
            console.log(error);
            return "Something went wrong";
        }
    }
    
    async incrementeUserDefeat( LoserID: string )
    {
        try 
        {
            let loserid : any = LoserID;

            const loserEntity: User = await this.userRepo.findOne({where: {id: loserid}});
            if ( !loserEntity )
                return "User not found";

            loserEntity.GameDefeat++;
            await this.userRepo.save(loserEntity);

            return `Successfully given defeat to ${LoserID}`
        }
        catch(error)
        {
            console.log(error);
            return "Something went wrong";
        }
    } 

    async addRankedGame( payload: RankedGameData ) : Promise<string>
    {
        try
        {
            let user1id : any = payload.Player1ID;
            let user2id : any = payload.Player2ID;
            const user1Entity: User = await this.userRepo.findOne({where: {id: user1id}});
            if ( !user1Entity )
               return "User 1 not found";

            const user2Entity: User = await this.userRepo.findOne({where: {id: user2id}});
            if ( !user2Entity )
                return "User 2 not found"

            const newRankedGame: GameRanked = this.gamerankedRepo.create({Player1ID: user1id,
                                                                        Player2ID: user2id,
                                                                        Player1Score: payload.Player1Score,
                                                                        Player2Score: payload.Player2Score,
                                                                        Player1Won: payload.Player1Won,
                                                                        Player2Won: payload.Player2Won,
                                                                        GameEndReason: payload.GameEndReason,
                                                                        User: [user1Entity, user2Entity]});
            await this.gamerankedRepo.save(newRankedGame);
            return "Game successfully added to Game History !";
        }
        catch( error )
        {
            console.error(error);
            return "Something went wrong registering game stats";
        }
    }

    async getGetGamesById( userID : string ) : Promise<GameRanked[]>
    {
        let userid : any = userID;

        try 
        {
            const userEntity: User = await this.userRepo.findOne({where: {id: userid}});
            if ( !userEntity )
               return undefined;

            const game = await this.gamerankedRepo.find({where: {User: userEntity}, relations: ['User'] });
            if ( !game )
                return undefined;
            return game;
        }
        catch(error)
        {
            console.error(error);
            return undefined;
        }
    }

    async getUserGames(userID: string ) : Promise<User>
    {
        let userid : any = userID;
        try
        {
            const user = await this.userRepo.findOne({where: {id : userid }, relations: ['Games'] })
            if ( !user )
                return undefined;
            return user;
        }
        catch(error)
        {
            console.log(error)
            return undefined;
        }
    }

    async checkUserID(userID: string ) : Promise<User>
    {
        let userid : any = userID;
        try
        {
            const user = await this.userRepo.findOne({where: {id : userid} })
            if ( !user )
                return undefined;
            return user;
        }
        catch(error)
        {
            console.log(error)
            return undefined;
        }
    }
}
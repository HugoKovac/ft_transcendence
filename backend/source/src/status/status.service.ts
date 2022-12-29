import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm";
import { Repository } from "typeorm";

export class StatusService
{
    constructor( @InjectRepository(User) private userRepo: Repository<User> ) {}


    async checkUserID( userID: string ) : Promise<User>
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

    async getUserStatus( userEntity: User ) : Promise<number>
    {
        try
        {
            const status = userEntity.status;
            if ( !status )
                return undefined;
            return status;
        }
        catch(error)
        {
            console.log("something went wrong ....")
            console.log(error);
        }
    }

    async ChangeUserStatus( userEntity : User, status: number, lobbyID : string ) : Promise<any>
    {
        try
        {
            if ( status == 2 && lobbyID )
            {
                userEntity.status = status;
                userEntity.LobbyID = lobbyID;   
            }
            else if ( status == 0 || status == 1 )
            {
                userEntity.status = status;
                userEntity.LobbyID = null;
            }
            else
            {
                userEntity.status = status;
                userEntity.LobbyID = null;
            }


            await this.userRepo.save(userEntity);

            return userEntity.status, userEntity.LobbyID
        }
        catch(error)
        {
            console.error(error);
            console.log("something went wrong");
            return undefined;
        }
    }
}
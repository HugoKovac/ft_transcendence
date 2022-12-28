import { InjectRepository } from "@nestjs/typeorm";
import { StatusEntity, User } from "src/typeorm";
import { Repository } from "typeorm";

export class StatusService
{
    constructor( @InjectRepository(User) private userRepo: Repository<User>,
                @InjectRepository(StatusEntity) private statusRepo: Repository<StatusEntity> ) {}


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

    async getUserStatus( userEntity: User ) : Promise<StatusEntity>
    {
        try
        {
            const status = this.statusRepo.findOne({where: {user: userEntity}});
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

    async ChangeUserStatus( userEntity : User, status: number, lobbyID : string ) : Promise<StatusEntity>
    {
        try
        {
            let StatusEntity = await this.statusRepo.findOne({ where: {user: userEntity} });
            if ( !StatusEntity )
            {
                if ( status == 2 && lobbyID )
                    StatusEntity = await this.statusRepo.create({CurrentStatus: status, LobbyID: lobbyID, user: userEntity});
                if ( status == 0 || status == 1 )
                    StatusEntity = await this.statusRepo.create({CurrentStatus: status, LobbyID: null, user: userEntity});
            }
            else if ( status == 2 && lobbyID )
            {
                StatusEntity.LobbyID = lobbyID;
                StatusEntity.CurrentStatus = status;
            }
            else
                StatusEntity.CurrentStatus = status;

            await this.statusRepo.save(StatusEntity);
            return StatusEntity;
        }
        catch(error)
        {
            console.error(error);
            console.log("something went wrong");
            return undefined;
        }
    }
}
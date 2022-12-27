import { IsString } from "class-validator";

export class LobbyJoinDto
{
    @IsString()
    lobbyId: string;

    @IsString()
    userID: string;
}

export class LobbyCreateDto
{
    @IsString()
    skin: string;

    @IsString()
    Paddle1color: string;

    @IsString()
    Paddle2color: string;

    @IsString()
    Ballcolor: string;

    @IsString()
    Netcolor: string;

    @IsString()
    userID: string;
}

export class JoinMatchmakingDto
{
    @IsString()
    SkinPref: string;

    @IsString()
    userID: string;
}
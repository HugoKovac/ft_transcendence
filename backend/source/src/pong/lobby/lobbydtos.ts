import { IsString } from "class-validator";

export class LobbyJoinDto
{
    @IsString()
    lobbyId: string;
}

export class LobbyCreateDto
{
    @IsString()
    skin: string;
}
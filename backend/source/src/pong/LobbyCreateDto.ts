import { IsString } from "class-validator";

export class LobbyCreateDto
{
    @IsString()
    skin: 'default';
}
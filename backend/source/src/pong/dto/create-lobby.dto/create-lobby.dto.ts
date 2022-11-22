import { IsString } from "class-validator";

export class CreateLobbyDto {

    @IsString()
    skin: 'basic';

}

import { IsNotEmpty, IsString } from "class-validator";

export class CreateSumsubauthDto {

    @IsString()
    @IsNotEmpty()
    levelName: string

    @IsString()
    @IsNotEmpty()
    userId: string
}

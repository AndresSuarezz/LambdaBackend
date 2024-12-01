import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsString({ each: true })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty({ each: true })
  to: string[];

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  urlVideo: string[];

  @IsString()
  @IsNotEmpty()
  roomId: string;
}

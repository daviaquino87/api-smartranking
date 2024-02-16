import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePlayerDTO {
  @MinLength(11)
  @MaxLength(19)
  @IsString()
  readonly phoneNumber: string;

  @IsEmail()
  readonly email: string;

  @MinLength(3)
  @IsString()
  name: string;
}

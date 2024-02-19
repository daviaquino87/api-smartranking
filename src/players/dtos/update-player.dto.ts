import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePlayerDTO {
  @MinLength(3)
  @IsString()
  name: string;

  @MinLength(11)
  @MaxLength(19)
  @IsString()
  readonly phoneNumber: string;
}

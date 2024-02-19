import { IsString, MinLength } from 'class-validator';

export class UpdatePlayerDTO {
  @MinLength(3)
  @IsString()
  name: string;
}

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

class CreateChallengePlayerDTO {
  _id: string;
}

export class CreateChallengeDTO {
  @IsDateString()
  @IsNotEmpty()
  challengeDate: Date;

  @IsNotEmpty()
  requester: string;

  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsArray()
  players: CreateChallengePlayerDTO[];
}

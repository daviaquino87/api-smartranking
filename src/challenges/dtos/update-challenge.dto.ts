import { ChallengeStatus } from '../enums/challenge-status.enum';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class updateChallengeDTO {
  @IsDateString()
  @IsOptional()
  challengeDate?: Date;

  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;
}

import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ChallengeStatusByUpdateEnum } from '../enums/update-status.enum';

export class updateChallengeDTO {
  @IsDateString()
  @IsOptional()
  challengeDate?: Date;

  @IsEnum(ChallengeStatusByUpdateEnum)
  @IsOptional()
  status?: ChallengeStatusByUpdateEnum;
}

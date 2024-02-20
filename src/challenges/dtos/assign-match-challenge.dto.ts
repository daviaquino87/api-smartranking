import { IsNotEmpty } from 'class-validator';

class CreateResultDTO {
  set: string;
}

class CreateDefDTO {
  _id: string;
}

export class AssignMatchChallengeDTO {
  @IsNotEmpty()
  def: CreateDefDTO;

  @IsNotEmpty()
  resultado: CreateResultDTO[];
}

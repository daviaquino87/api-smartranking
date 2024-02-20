import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';
import { IsNotEmpty } from 'class-validator';

export class AssignMatchChallengeDTO {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  resultado: Result[];
}

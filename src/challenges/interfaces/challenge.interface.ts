import { Document } from 'mongoose';
import { Player } from '../../players/interfaces/player.interface';
import { ChallengeStatusEnum } from '../enums/challenge-status.enum';
import { Category } from '../../categories/interfaces/category.interface';

export interface Challenge extends Document {
  challengeDate: Date;
  status: ChallengeStatusEnum;
  requestDate: Date;
  answerDate: Date;
  requester: Player;
  category: Category;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export interface Result {
  set: string;
}

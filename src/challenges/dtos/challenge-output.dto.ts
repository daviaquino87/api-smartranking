import { PlayerOutputDTO } from 'src/players/dtos/player-output.dto';
import { ChallengeStatusEnum } from '../enums/challenge-status.enum';
import { Challenge, Match, Result } from '../interfaces/challenge.interface';
import { CategoryWithoutPlayersOutputDTO } from '../../categories/dtos/category-output.dto';

class ResultOutputDTO {
  _id: string;
  set: string;

  static toHttp(result: Result): ResultOutputDTO {
    return {
      _id: result._id,
      set: result.set,
    };
  }
}

class MatchOutputDTO {
  _id: string;
  category: string;
  def: string;
  result: ResultOutputDTO[];

  static toHttp(match: Match): MatchOutputDTO {
    return {
      _id: match._id,
      category: match.category,
      def: String(match.def),
      result: match.result.map((result) => ResultOutputDTO.toHttp(result)),
    };
  }
}

export class ChallengeOutputDTO {
  _id: string;
  challengeDate: Date;
  status: ChallengeStatusEnum;
  requestDate: Date;
  answerDate: Date;
  requester: string;
  category: CategoryWithoutPlayersOutputDTO;
  players: PlayerOutputDTO[];
  match: MatchOutputDTO;

  static toHttp(challenge: Challenge): ChallengeOutputDTO {
    return {
      _id: challenge._id,
      challengeDate: challenge.challengeDate,
      status: challenge.status,
      requestDate: challenge.requestDate,
      answerDate: challenge.answerDate,
      requester: String(challenge.requester),
      category: CategoryWithoutPlayersOutputDTO.toHttp(challenge.category),
      players: challenge?.players.map((player) =>
        PlayerOutputDTO.toHttp(player),
      ),
      match: challenge?.match ? MatchOutputDTO.toHttp(challenge?.match) : null,
    };
  }
}

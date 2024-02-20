import { PlayerOutputDTO } from 'src/players/dtos/player-output.dto';
import { ChallengeStatus } from '../enums/challenge-status.enum';
import { Challenge } from '../interfaces/challenge.interface';
import { CategoryWithoutPlayersOutputDTO } from '../../categories/dtos/category-output.dto';

export class ChallengeOutputDTO {
  _id: string;
  challengeDate: Date;
  status: ChallengeStatus;
  requestDate: Date;
  answerDate: Date;
  requester: string;
  category: CategoryWithoutPlayersOutputDTO;
  players: PlayerOutputDTO[];

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
    };
  }
}

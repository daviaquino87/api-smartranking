import { Player } from '../interfaces/player.interface';

export class PlayerOutputDTO {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  ranking: string;
  rankingPosition: number;
  playerPictureUrl: string;

  static toHttp(player: Player): PlayerOutputDTO {
    return {
      _id: player._id,
      name: player.name,
      phoneNumber: player.phoneNumber,
      email: player.email,
      ranking: player?.ranking ?? '',
      rankingPosition: player?.rankingPosition ?? 0,
      playerPictureUrl: player?.playerPictureUrl ?? '',
    };
  }
}

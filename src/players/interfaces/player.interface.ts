import { Document } from 'mongoose';

export class Player extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  playerPictureUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

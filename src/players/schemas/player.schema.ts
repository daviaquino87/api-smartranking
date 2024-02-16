import * as mongoose from 'mongoose';

export const playerSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    ranking: String,
    rankingPosition: Number,
    playerPictureUrl: String,
  },
  { timestamps: true, collection: 'players' },
);

import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    email: { type: String, unique: true },
    ranking: String,
    rankingPosition: Number,
    playerPictureUrl: String,
  },
  { timestamps: true, collection: 'players' },
);

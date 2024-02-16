import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface GetPlayersOutput {
  players: Player[];
}

interface GetPlayerByEmailOutput {
  player: Player;
}

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(createPlayerDto: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDto;

    const userAlreadyExists = await this.playerModel.findOne({ email }).exec();

    if (userAlreadyExists) {
      await this.updatePlayer(createPlayerDto);
      return;
    }

    this.createPlayer(createPlayerDto);
  }

  async getPlayers(): Promise<GetPlayersOutput> {
    const players = await this.playerModel.find().exec();

    return {
      players,
    };
  }

  async getPlayerByEmail(email: string): Promise<GetPlayerByEmailOutput> {
    const player = await this.playerModel.findOne({ email }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return {
      player,
    };
  }

  async deletePlayer(email: string): Promise<void> {
    const player = await this.playerModel.findOne({ email }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    this.playerModel.deleteOne({ email }).exec();
  }

  private async createPlayer(
    createPlayerDto: CreatePlayerDTO,
  ): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    return player.save();
  }

  private async updatePlayer(
    createPlayerDto: CreatePlayerDTO,
  ): Promise<Player> {
    return this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
  }
}

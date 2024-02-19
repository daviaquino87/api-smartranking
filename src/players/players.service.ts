import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createPlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDto;

    const userAlreadyExists = await this.playerModel.findOne({ email }).exec();

    if (userAlreadyExists) {
      throw new ConflictException('Player already exists');
    }

    const player = new this.playerModel(createPlayerDto);
    return player.save();
  }

  async updatePlayer(
    id: string,
    createPlayerDto: CreatePlayerDTO,
  ): Promise<void> {
    const player = await this.playerModel.findOne({ _id: id }).exec();

    if (!player) {
      throw new NotFoundException('Player Not Found');
    }
    await this.playerModel
      .findOneAndUpdate({ _id: id }, { $set: createPlayerDto })
      .exec();
  }

  async getPlayers(): Promise<GetPlayersOutput> {
    const players = await this.playerModel.find().exec();

    return {
      players,
    };
  }

  async getPlayerById(id: string): Promise<GetPlayerByEmailOutput> {
    const player = await this.playerModel.findOne({ _id: id }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return {
      player,
    };
  }

  async deletePlayer(id: string): Promise<void> {
    const player = await this.playerModel.findOne({ _id: id }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    this.playerModel.deleteOne({ _id: id }).exec();
  }
}

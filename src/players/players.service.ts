import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

interface GetPlayersOutput {
  players: Player[];
}

interface CreatePlayerOutput {
  player: Player;
}

type GetPlayerByIdOutput = CreatePlayerOutput;

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(
    createPlayerDto: CreatePlayerDTO,
  ): Promise<CreatePlayerOutput> {
    const { email } = createPlayerDto;

    const userAlreadyExists = await this.playerModel.findOne({ email });

    if (userAlreadyExists) {
      throw new ConflictException('Player already exists');
    }

    const player = new this.playerModel(createPlayerDto);
    const playerCreated = await player.save();

    return {
      player: playerCreated,
    };
  }

  async updatePlayer(
    id: string,
    createPlayerDto: UpdatePlayerDTO,
  ): Promise<void> {
    const player = await this.playerModel.findOne({ _id: id });

    if (!player) {
      throw new NotFoundException('Player Not Found');
    }
    await this.playerModel.findOneAndUpdate(
      { _id: id },
      { $set: createPlayerDto },
    );
  }

  async getPlayers(): Promise<GetPlayersOutput> {
    const players = await this.playerModel.find();

    return {
      players,
    };
  }

  async getPlayerById(id: string): Promise<GetPlayerByIdOutput> {
    const player = await this.playerModel.findOne({ _id: id });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return {
      player,
    };
  }

  async deletePlayer(id: string): Promise<void> {
    const player = await this.playerModel.findOne({ _id: id });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    this.playerModel.deleteOne({ _id: id });
  }
}

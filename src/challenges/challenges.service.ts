import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { PlayersService } from '../players/players.service';
import { CategoriesService } from '../categories/categories.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeStatus } from './enums/challenge-status.enum';

interface CreateChallengeOutput {
  challenge: Challenge;
}

interface GetChallengesOutput {
  challenges: Challenge[];
}

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playerService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDTO,
  ): Promise<CreateChallengeOutput> {
    if (
      createChallengeDto.players[0]._id === createChallengeDto.players[1]._id
    ) {
      throw new BadRequestException(
        'The players in the match must be different',
      );
    }

    for (const player of createChallengeDto.players) {
      const playerInDatabase = await this.playerService.getPlayerById(
        player._id,
      );

      if (!playerInDatabase) {
        throw new BadRequestException(`player ${player._id} not found`);
      }
    }

    const requesterExisteInPlayers = createChallengeDto.players.some(
      (player) => player._id == createChallengeDto.requester,
    );

    if (!requesterExisteInPlayers) {
      throw new BadRequestException(
        `The requester must be a player in the match!`,
      );
    }

    const { category } = await this.categoriesService.getCategoryByPlayerId(
      createChallengeDto.requester,
    );

    const createdChallenge = new this.challengeModel({
      ...createChallengeDto,
      status: ChallengeStatus.PENDING,
      category: category,
      requestDate: new Date(),
    });

    const challenge = await (
      await createdChallenge.save()
    ).populate(['players', 'category']);

    return {
      challenge,
    };
  }

  async getChallenges(): Promise<GetChallengesOutput> {
    const challenges = await this.challengeModel
      .find()
      .populate(['players', 'category']);

    return {
      challenges,
    };
  }
}

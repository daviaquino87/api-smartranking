import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { Challenge, Match } from './interfaces/challenge.interface';
import { PlayersService } from '../players/players.service';
import { CategoriesService } from '../categories/categories.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeStatusEnum } from './enums/challenge-status.enum';
import { updateChallengeDTO } from './dtos/update-challenge.dto';
import { AssignMatchChallengeDTO } from './dtos/assign-match-challenge.dto';

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
    @InjectModel('Match') private readonly matchModel: Model<Match>,
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
      status: ChallengeStatusEnum.PENDING,
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
      .populate(['players', 'category', 'match']);

    return {
      challenges,
    };
  }

  async getChallengesByPlayerId(id: string): Promise<GetChallengesOutput> {
    const challenges = await this.challengeModel
      .find()
      .where('players')
      .in([id])
      .populate(['players', 'category']);

    return {
      challenges,
    };
  }

  async assignMatchChallenge(
    id: string,
    assignMatchChallengeDto: AssignMatchChallengeDTO,
  ): Promise<void> {
    const challenge = await this.challengeModel.findOne({ _id: id });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (challenge.status !== ChallengeStatusEnum.ACCEPTED) {
      throw new BadRequestException('Challenge cannot receive assignments');
    }

    const playerDefIsAssigned = challenge.players.some(
      (player) => player._id == assignMatchChallengeDto.def,
    );

    if (playerDefIsAssigned) {
      throw new BadRequestException(
        `The winning player does not take part in the match`,
      );
    }

    const createdMatch = new this.matchModel({
      ...assignMatchChallengeDto,
      category: challenge.category,
      players: challenge.players,
    });

    const result = await createdMatch.save();

    challenge.status = ChallengeStatusEnum.ACCOMPLISHED;
    challenge.match = result._id;

    try {
      await this.challengeModel.findOneAndUpdate(
        { _id: id },
        { $set: challenge },
      );
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id });
      throw new InternalServerErrorException();
    }
  }

  async updateChallenge(
    id: string,
    updateChallengeDto: updateChallengeDTO,
  ): Promise<void> {
    const challenge = await this.challengeModel.findOne({ _id: id });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (updateChallengeDto.status) {
      challenge.status = ChallengeStatusEnum[updateChallengeDto.status];
      challenge.answerDate = new Date();
    }

    challenge.challengeDate = updateChallengeDto.challengeDate;

    await this.challengeModel.findOneAndUpdate(
      { _id: id },
      { $set: challenge },
    );
  }

  async deleteChallenge(id: string): Promise<void> {
    const challenge = await this.challengeModel.findOne({ _id: id });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    challenge.status = ChallengeStatusEnum.CANCELLED;

    await this.challengeModel.findOneAndUpdate(
      { _id: id },
      { $set: challenge },
    );
  }
}

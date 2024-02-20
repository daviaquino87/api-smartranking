import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { ChallengeOutputDTO } from './dtos/challenge-output.dto';
import { ApiTags } from '@nestjs/swagger';
import { updateChallengeDTO } from './dtos/update-challenge.dto';
import { AssignMatchChallengeDTO } from './dtos/assign-match-challenge.dto';

@ApiTags('Challenges')
@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDTO,
  ): Promise<ChallengeOutputDTO> {
    const { challenge } =
      await this.challengesService.createChallenge(createChallengeDto);

    return ChallengeOutputDTO.toHttp(challenge);
  }

  @Get()
  async getChallenges(): Promise<ChallengeOutputDTO[]> {
    const { challenges } = await this.challengesService.getChallenges();

    return challenges?.map((challenge) => ChallengeOutputDTO.toHttp(challenge));
  }

  @Get('/player/:playerId')
  async getChallengeByPlayerId(
    @Param('playerId') id: string,
  ): Promise<ChallengeOutputDTO[]> {
    const { challenges } =
      await this.challengesService.getChallengesByPlayerId(id);

    return challenges?.map((challenge) => ChallengeOutputDTO.toHttp(challenge));
  }

  @Post('/:challengeId/machs')
  async assignMatchChallenge(
    @Body() assignMatchChallengeDto: AssignMatchChallengeDTO,
    @Param('challengeId') challengeId: string,
  ): Promise<void> {
    return await this.challengesService.assignMatchChallenge(
      challengeId,
      assignMatchChallengeDto,
    );
  }

  @Put(':id')
  async updateChallenge(
    @Param('id') id: string,
    @Body() updateChallengeDto: updateChallengeDTO,
  ) {
    await this.challengesService.updateChallenge(id, updateChallengeDto);
  }

  @Delete(':id')
  async deleteChallenge(@Param('id') id: string): Promise<void> {
    await this.challengesService.deleteChallenge(id);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { ChallengeOutputDTO } from './dtos/challenge-output.dto';
import { ApiTags } from '@nestjs/swagger';

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
}

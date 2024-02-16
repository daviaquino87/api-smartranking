import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { PlayerOutputDTO } from './dtos/player-output.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Players')
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDTO) {
    await this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(): Promise<PlayerOutputDTO[]> {
    const { players } = await this.playersService.getPlayers();

    return players.map((player) => PlayerOutputDTO.toHttp(player));
  }

  @Get(':email')
  async getPlayerById(@Param('email') email: string): Promise<PlayerOutputDTO> {
    const { player } = await this.playersService.getPlayerByEmail(email);

    return PlayerOutputDTO.toHttp(player);
  }

  @Delete(':email')
  async deletePlayer(@Param('email') email: string): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}

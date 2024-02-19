import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { PlayerOutputDTO } from './dtos/player-output.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@ApiTags('Players')
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDTO,
  ): Promise<PlayerOutputDTO> {
    const { player } = await this.playersService.createPlayer(createPlayerDto);

    return PlayerOutputDTO.toHttp(player);
  }

  @Get()
  async getPlayers(): Promise<PlayerOutputDTO[]> {
    const { players } = await this.playersService.getPlayers();

    return players.map((player) => PlayerOutputDTO.toHttp(player));
  }

  @Get(':id')
  async getPlayerById(@Param('id') id: string): Promise<PlayerOutputDTO> {
    const { player } = await this.playersService.getPlayerById(id);

    return PlayerOutputDTO.toHttp(player);
  }

  @Put(':id')
  async updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDTO,
  ) {
    await this.playersService.updatePlayer(id, updatePlayerDto);
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string): Promise<void> {
    await this.playersService.deletePlayer(id);
  }
}

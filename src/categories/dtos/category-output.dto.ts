import { PlayerOutputDTO } from 'src/players/dtos/player-output.dto';
import { Category, Event } from '../interfaces/category.interface';

class EventOutputDTO {
  name: string;
  operation: string;
  value: number;

  static toHttp(event: Event): EventOutputDTO {
    return {
      name: event.name,
      operation: event.operation,
      value: event.value,
    };
  }
}

export class CategoryOutputDTO {
  _id: string;
  category: string;
  description: string;
  events: EventOutputDTO[];
  players?: PlayerOutputDTO[];

  static toHttp(category: Category): CategoryOutputDTO {
    return {
      _id: category._id,
      category: category.category,
      description: category.description,
      events: category?.events.map((event) => EventOutputDTO.toHttp(event)),
      players: category?.players.map((player) =>
        PlayerOutputDTO.toHttp(player),
      ),
    };
  }
}

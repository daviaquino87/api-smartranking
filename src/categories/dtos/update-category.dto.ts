import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { CreateEventDTO } from './create-category.dto';

class UpdateEventDTO extends CreateEventDTO {}

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  description?: string;

  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  events?: UpdateEventDTO[];
}

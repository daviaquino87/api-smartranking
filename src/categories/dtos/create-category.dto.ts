import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  operation: string;

  @IsInt()
  @IsNotEmpty()
  value: number;
}

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  category: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: CreateEventDTO[];
}

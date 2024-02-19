import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryOutputDTO } from './dtos/category-output.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDTO,
  ): Promise<CategoryOutputDTO> {
    const { category } =
      await this.categoriesService.createCategory(createCategoryDto);

    return CategoryOutputDTO.toHttp(category);
  }
}

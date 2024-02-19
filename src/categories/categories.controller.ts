import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryOutputDTO } from './dtos/category-output.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

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

  @Get()
  async getCategories(): Promise<CategoryOutputDTO[]> {
    const { categories } = await this.categoriesService.getCategories();

    return categories.map((category) => CategoryOutputDTO.toHttp(category));
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryOutputDTO> {
    const { category } = await this.categoriesService.getCategoryById(id);

    return CategoryOutputDTO.toHttp(category);
  }

  @Put(':id')
  async updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDTO,
  ): Promise<void> {
    await this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Post(':category/players/:playerId')
  async setPlayerInCategory(
    @Param('category') category: string,
    @Param('playerId') playerId: string,
  ) {
    await this.categoriesService.setPlayerInCategory(category, playerId);
  }
}

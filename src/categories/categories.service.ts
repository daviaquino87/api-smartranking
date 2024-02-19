import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './dtos/create-category.dto';

interface CreateCategoryOutput {
  category: Category;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDTO,
  ): Promise<CreateCategoryOutput> {
    const categoryAlreadyExists = await this.categoryModel
      .findOne({
        category: createCategoryDto.category,
      })
      .exec();

    if (categoryAlreadyExists) {
      throw new ConflictException('Category already exists');
    }

    const category = new this.categoryModel(createCategoryDto);
    const categoryCreated = await category.save();

    return {
      category: categoryCreated,
    };
  }
}

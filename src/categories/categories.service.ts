import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

interface CreateCategoryOutput {
  category: Category;
}

type GetCategoryByIdOutput = CreateCategoryOutput;

interface GetCategoriesOutput {
  categories: Category[];
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

  async getCategories(): Promise<GetCategoriesOutput> {
    const categories = await this.categoryModel.find().exec();

    return {
      categories,
    };
  }

  async getCategoryById(id: string): Promise<GetCategoryByIdOutput> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      category,
    };
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDTO,
  ): Promise<void> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryModel
      .findOneAndUpdate({ _id: id }, { $set: updateCategoryDto })
      .exec();
  }
}

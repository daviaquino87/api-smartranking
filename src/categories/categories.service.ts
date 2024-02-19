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
import { PlayersService } from 'src/players/players.service';

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
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDTO,
  ): Promise<CreateCategoryOutput> {
    const categoryAlreadyExists = await this.categoryModel.findOne({
      category: createCategoryDto.category,
    });
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
    const categories = await this.categoryModel.find().populate('players');
    return {
      categories,
    };
  }

  async getCategoryById(id: string): Promise<GetCategoryByIdOutput> {
    const category = await this.categoryModel
      .findOne({ _id: id })
      .populate('players');
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
    const category = await this.categoryModel.findOne({ _id: id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: updateCategoryDto },
    );
  }

  async setPlayerInCategory(categoryName: string, playerId: string) {
    const category = await this.categoryModel.findOne({
      category: categoryName,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.playersService.getPlayerById(playerId);

    const playerAlreadyAllocated = await this.categoryModel.exists({
      category: categoryName,
      players: { $in: [playerId] },
    });
    if (playerAlreadyAllocated) {
      throw new ConflictException('Player already in category');
    }

    await this.categoryModel.findOneAndUpdate(
      { category: categoryName },
      { $push: { players: playerId } },
    );
  }
}

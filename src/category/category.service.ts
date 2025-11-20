import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subCategory-dto';
import { GenericResponse } from 'src/__share__/dto/generic-response.dto';
import { promises } from 'dns';
import { UpdateCategoryDto } from './dto/update Dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto.Input,
  ): Promise<GenericResponse<Category>> {
    return await this.categoryModel
      .create({
        ...createCategoryDto,
        parentCategory: null,
      })
      .then((category) => {
        return new GenericResponse('Category Created Successfully!', category);
      });
  }

  async createSubcategory(
    parentId: string,
    createSubcategoryDto: CreateSubcategoryDto.Input,
  ): Promise<GenericResponse<Category>> {
    return await this.categoryModel
      .findById(parentId)
      .then((parentCategory) => {
        if (!parentCategory) {
          throw new NotFoundException(
            `Parent category with ID ${parentId} not found`,
          );
        }
        return this.categoryModel.create({
          ...createSubcategoryDto,
          parentCategory: parentId,
        });
      })
      .then((subcategory) => {
        return new GenericResponse(
          'Subcategory Created Successfully!',
          subcategory,
        );
      });
  }

  async getAllCategories(): Promise<GenericResponse<Category[]>> {
    const categories = await this.categoryModel
      .find({ parentCategory: null })
      .exec();
    return new GenericResponse(
      'Categories Retrieved Successfully!',
      categories,
    );
  }

  async getCategoryById(id: string): Promise<GenericResponse<Category>> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return new GenericResponse('Category Retrieved Successfully!', category);
  }


  async deleteCategory(categoryId: string): Promise<GenericResponse<string>> {
  const category = await this.categoryModel.findById(categoryId).exec();
  if (!category) {
    throw new NotFoundException(`Category with ID ${categoryId} not found`);
  }

  await this.categoryModel.findByIdAndDelete(categoryId);

  return new GenericResponse('delete category be succefully!',categoryId)
}

async deleteSubCategory(subcategoryId:string) : Promise<GenericResponse<string>>{
  const subCategory = await this.categoryModel.findById(subcategoryId).exec();
  if(!subCategory){
     throw new NotFoundException(`sub category with ${subcategoryId} not found!`)
  }
  if(!subCategory.parentCategory){
     throw new BadRequestException('this category is a not subcategory')
  }
  await this.categoryModel.findByIdAndDelete(subcategoryId)
  return new GenericResponse('SubCategory Deleted Succefuly!',subcategoryId)

}


  async getSubcategories(
    parentId: string,
  ): Promise<GenericResponse<Category[]>> {
    const parentCategory = await this.categoryModel.findById(parentId).exec();
    if (!parentCategory) {
      throw new NotFoundException(
        `Parent category with ID ${parentId} not found`,
      );
    }

    const subcategories = await this.categoryModel
      .find({ parentCategory: parentId })
      .exec();
    return new GenericResponse(
      'Subcategories Retrieved Successfully!',
      subcategories,
    );
  }

  
  async updateCategory(
  categoryId: string,
  updateData: UpdateCategoryDto
): Promise<GenericResponse<Category>> {

  
  const category = await this.categoryModel.findById(categoryId).exec();
  if (!category) {
    throw new NotFoundException(`Category with ID ${categoryId} not found`);
  }

  if (updateData.parentCategory) {
    const parent = await this.categoryModel.findById(updateData.parentCategory).exec();
    if (!parent) {
      throw new BadRequestException(`Parent category not found`);
    }

    if (updateData.parentCategory === categoryId) {
      throw new BadRequestException(`A category cannot be its own parent`);
    }
  }

   await this.categoryModel
    .findByIdAndUpdate(categoryId, updateData, { new: true })
    .exec();
return new GenericResponse<Category>(
  'Category updated successfully!'
  
);

}
}




import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subCategory-dto';
import { GenericResponse } from 'src/__share__/dto/generic-response.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}
  
  async  createCategory(createCategoryDto: CreateCategoryDto.Input): Promise<GenericResponse<Category>> {
        return await this.categoryModel.create({
            ...createCategoryDto,
            parentCategory: null
        }).then(category => {
            return new GenericResponse('Category Created Successfully!', category);
        });
    }

   async createSubcategory(parentId: string, createSubcategoryDto: CreateSubcategoryDto.Input): Promise<GenericResponse<Category>> {
        return await this.categoryModel.findById(parentId)
            .then(parentCategory => {
                if (!parentCategory) {
                    throw new NotFoundException(`Parent category with ID ${parentId} not found`);
                }
                return this.categoryModel.create({
                    ...createSubcategoryDto,
                    parentCategory: parentId
                });
            })
            .then(subcategory => {
                return new GenericResponse('Subcategory Created Successfully!', subcategory);
            });
    }

       async getAllCategories(): Promise<GenericResponse<Category[]>> {
        const categories = await this.categoryModel.find({ parentCategory: null }).exec();
        return new GenericResponse('Categories Retrieved Successfully!', categories);
    }


     async getCategoryById(id: string): Promise<GenericResponse<Category>> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return new GenericResponse('Category Retrieved Successfully!', category);
    }


       async getSubcategories(parentId: string): Promise<GenericResponse<Category[]>> {
        const parentCategory = await this.categoryModel.findById(parentId).exec();
        if (!parentCategory) {
            throw new NotFoundException(`Parent category with ID ${parentId} not found`);
        }
        
        const subcategories = await this.categoryModel.find({ parentCategory: parentId }).exec();
        return new GenericResponse('Subcategories Retrieved Successfully!', subcategories);
    }

    
    async getAllCategoriesWithSubcategories(): Promise<GenericResponse<any[]>> {
        const categories = await this.categoryModel.find({ parentCategory: null }).exec();
        
        const categoriesWithSubs = await Promise.all(
            categories.map(async (category) => {
                const subcategories = await this.categoryModel.find({ 
                    parentCategory: category._id 
                }).exec();
                
                return {
                    ...category.toObject(),
                    subcategories
                };
            })
        );
        
        return new GenericResponse('Categories with Subcategories Retrieved Successfully!', categoriesWithSubs);
    }



}
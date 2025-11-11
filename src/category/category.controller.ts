import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subCategory-dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryservice: CategoryService) {}
    
    @Post()
   async createCategory(@Body() createCategoryDto: CreateCategoryDto.Input) {
        return await this.categoryservice.createCategory(createCategoryDto);
    }

    @Post(':parentId/subcategory')
   async createSubcategory(
        @Param('parentId') parentId: string,
        @Body() createSubcategoryDto: CreateSubcategoryDto.Input
    ) {
        return await this.categoryservice.createSubcategory(parentId, createSubcategoryDto);
    }

     @Get()
    async getAllCategories() {
        return await this.categoryservice.getAllCategories();
    }

        @Get('with-subcategories')
    async getAllCategoriesWithSubcategories() {
        return await this.categoryservice.getAllCategoriesWithSubcategories();
    }

      @Get(':id')
    async getCategoryById(@Param('id') id: string) {
        return await this.categoryservice.getCategoryById(id);
    }

     @Get(':parentId/subcategories')
    async getSubcategories(@Param('parentId') parentId: string) {
        return await this.categoryservice.getSubcategories(parentId);
    }
}
import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subCategory-dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsAdmin } from 'src/__share__/decorator/auth-decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryservice: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto.Input) {
    return await this.categoryservice.createCategory(createCategoryDto);
  }

  @Get()
  @IsAdmin()
  @ApiOperation({ summary: 'Get all category' })
  async getAllCategories() {
    return await this.categoryservice.getAllCategories();
  }

  @Post('sub-category/:parentId')
  @ApiOperation({ summary: 'Create sub category' })
  async createSubcategory(
    @Param('parentId') parentId: string,
    @Body() createSubcategoryDto: CreateSubcategoryDto.Input,
  ) {
    return await this.categoryservice.createSubcategory(
      parentId,
      createSubcategoryDto,
    );
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get category by is' })
  async getCategoryById(@Param('id') id: string) {
    return await this.categoryservice.getCategoryById(id);
  }

  @Get('sub-category/:parentId')
  @ApiOperation({ summary: 'Get sub category by thier parent category' })
  async getSubcategories(@Param('parentId') parentId: string) {
    return await this.categoryservice.getSubcategories(parentId);
  }
}

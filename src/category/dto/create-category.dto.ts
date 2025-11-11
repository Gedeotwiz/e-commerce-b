
import { IsString, IsNotEmpty } from 'class-validator';

export namespace CreateCategoryDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    image: string;
  }

  export class Output {
    _id: string;
    name: string;
    image: string;
    parentCategory: null;
    createdAt: Date;
    updatedAt: Date;
  }
}
import { IsString, IsNotEmpty } from 'class-validator';

export namespace CreateSubcategoryDto {
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
    parentCategory: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
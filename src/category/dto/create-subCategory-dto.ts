import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export namespace CreateSubcategoryDto {
  export class Input {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
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

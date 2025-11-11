import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}


export class PageResponseDto<T> {
  @ApiProperty({ type: [Object] })
  items: T[];

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  constructor(items: T[], totalItems: number, page: number, limit: number) {
    this.items = items;
    this.totalItems = totalItems;
    this.currentPage = page;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}

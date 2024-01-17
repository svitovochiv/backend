import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductQuery {
  @ApiProperty({
    required: false,
    type: Number,
    example: 10,
    description: 'limit of products',
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    required: false,
    type: String,
    example: 'uuid',
    description: 'product id',
  })
  @IsString()
  @IsOptional()
  cursor?: string;

  @ApiProperty({
    required: false,
    type: String,
    example: 'Orange',
    description: 'product name',
  })
  @IsString()
  @IsOptional()
  withName?: string;

  @ApiProperty({
    required: false,
    type: Number,
    example: 10,
    description: 'number of products to skip',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    } else if (typeof value === 'number') {
      return value;
    }
  })
  take?: number;

  @ApiProperty({
    required: false,
    type: Number,
    example: 10,
    description: 'number of products to take',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    } else if (typeof value === 'number') {
      return value;
    }
  })
  skip?: number;
}

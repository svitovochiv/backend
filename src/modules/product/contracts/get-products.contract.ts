import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../../domain';

export class GetProductsContractReq {
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
}

export class GetProductsContractRes {
  products: {
    id: string;
    name: string;
    price: number;
    quantity: string;
    isActive: boolean;
  }[];

  constructor(getProductsContractRes: GetProductsContractRes) {
    this.products = getProductsContractRes.products;
  }

  static fromProducts(products: ProductDto[]) {
    return new GetProductsContractRes({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity.value,
        isActive: product.isActive,
      })),
    });
  }
}

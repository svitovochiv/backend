import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ProductQuery } from '../product-query';
import {
  ProductCollectionDto,
  Quantities,
  UnknownQuantity,
} from '../../../../domain';

class ClientProduct {
  @ApiProperty({
    type: String,
    example: 'uuid',
    description: 'product id',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Orange',
    description: 'product name',
  })
  name: string;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'product price',
  })
  price: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'product quantity',
  })
  quantity: Quantities | typeof UnknownQuantity;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'product status',
  })
  isActive: boolean;

  constructor(clientProduct: ClientProduct) {
    this.id = clientProduct.id;
    this.name = clientProduct.name;
    this.price = clientProduct.price;
    this.quantity = clientProduct.quantity;
    this.isActive = clientProduct.isActive;
  }
}

const exampleClientProduct = new ClientProduct({
  isActive: true,
  name: 'Orange',
  price: 10,
  quantity: Quantities.Kilogram,
  id: 'uuid',
});

export namespace GetClientProductsContract {
  export class Request extends ProductQuery {}

  export class Response {
    @ApiProperty({
      type: Number,
      example: 10,
      description: 'total number of products',
    })
    @IsNumber()
    total!: number;

    @ApiProperty({
      type: [ClientProduct],
      example: [exampleClientProduct],
      description: 'products',
    })
    products!: ClientProduct[];

    constructor(response: Response) {
      this.total = response.total;
      this.products = response.products;
    }

    static fromProductCollection(products: ProductCollectionDto) {
      return new Response({
        total: products.total,
        products: products.products.map(
          (product) => new ClientProduct(product.toJSON()),
        ),
      });
    }
  }
}

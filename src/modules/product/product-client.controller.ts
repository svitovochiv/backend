import { Controller, Get, Logger, Query } from '@nestjs/common';
import { IsPublic } from '../auth';
import { GetProductsQueryDto } from '../../domain';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { GetClientProductsContract, GetProductsContractRes } from './contracts';

@Controller('client/products')
export class ProductClientController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  async getProducts(@Query() params: GetClientProductsContract.Request): // ,
  Promise<GetProductsContractRes> {
    this.logger.log('get products');
    const productCollection = await this.productService.getProductCollection(
      new GetProductsQueryDto({ isActive: true, ...params }),
    );
    return GetClientProductsContract.Response.fromProductCollection(
      productCollection,
    );
  }
}

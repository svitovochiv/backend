import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, IsPublic } from '../auth';
import { GetProductsQueryDto, UploadProductViaFileDto } from '../../domain';
import { ProductService } from './product.service';
import { GetProductsContractReq, GetProductsContractRes } from './contracts';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @UseGuards(new AuthGuard())
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async createProductsViaFile(@UploadedFile() file: Express.Multer.File) {
    await this.productService.createProductsViaFile(
      new UploadProductViaFileDto(file),
    );
  }

  @Get()
  @IsPublic()
  async getProducts(@Query() params: GetProductsContractReq): // ,
  Promise<GetProductsContractRes> {
    this.logger.log('get products');
    // console.log('params', params);
    const products = await this.productService.getProducts(
      new GetProductsQueryDto({ isActive: true, ...params }),
    );
    return GetProductsContractRes.fromProducts(products);
  }
}

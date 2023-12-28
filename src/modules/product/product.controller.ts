import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard, IsPublic } from '../auth';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProductViaFileDto } from '../../domain';
import { GetProductsContractRes } from './contracts';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(new AuthGuard())
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async createProductsViaFile(@UploadedFile() file: Express.Multer.File) {
    await this.productService.createProductsViaFile(
      new UploadProductViaFileDto(file),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @IsPublic()
  async getProducts(): Promise<GetProductsContractRes> {
    const products = await this.productService.getProducts({ isActive: true });
    return GetProductsContractRes.fromProducts(products);
  }
}

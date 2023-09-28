import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProductViaFileDto } from '../../domain';

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

  @Get()
  async getProducts() {
    return await this.productService.getProducts();
  }
}

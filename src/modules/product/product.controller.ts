import {
  Controller,
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
  createProductsViaFile(@UploadedFile() file: Express.Multer.File) {
    return this.productService.createProductsViaFile(
      new UploadProductViaFileDto(file),
    );
  }
}

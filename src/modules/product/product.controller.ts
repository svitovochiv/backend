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

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(new AuthGuard())
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  createProductsViaFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file: ', file);
    return 'Hello World!';
  }
}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductClientController } from './product-client.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController, ProductClientController],
})
export class ProductModule {}

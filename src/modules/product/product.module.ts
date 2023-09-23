import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [PrismaModule],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

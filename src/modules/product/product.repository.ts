import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AddProductDto } from '../../domain';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  addManyProducts(addProductDto: AddProductDto[]) {
    return this.product.createMany({
      data: addProductDto,
    });
  }

  getProducts() {
    return this.product.findMany();
  }

  private get product() {
    return this.prismaService.product;
  }
}

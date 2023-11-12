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

  // TODO optimize this method
  async updateManyProducts(addProductDtos: AddProductDto[]) {
    for (const addProductDtoItem of addProductDtos) {
      await this.product.update({
        data: addProductDtoItem,
        where: {
          name: addProductDtoItem.name,
        },
      });
    }
  }

  deactivateProducts(productNames: string[]) {
    return this.product.updateMany({
      where: {
        name: {
          in: productNames,
        },
      },
      data: {
        isActive: false,
      },
    });
  }

  getProducts() {
    return this.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  private get product() {
    return this.prismaService.product;
  }
}

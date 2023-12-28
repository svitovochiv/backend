import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { AddProductDto } from '../../domain';
@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  addManyProducts(addProductDto: AddProductDto[]) {
    const formattedAddProductDto: Prisma.ProductCreateManyInput[] =
      addProductDto.map((product) => ({
        name: product.name,
        quantity: product.quantity.value,
        price: product.price,
        isActive: product.isActive,
      }));

    return this.product.createMany({
      data: formattedAddProductDto,
    });
  }

  // TODO optimize this method
  async updateManyProducts(addProductDtos: AddProductDto[]) {
    for (const addProductDtoItem of addProductDtos) {
      // TODO change when create generic mapper

      await this.product.update({
        data: {
          quantity: addProductDtoItem.quantity.value,
          price: addProductDtoItem.price,
          isActive: addProductDtoItem.isActive,
          name: addProductDtoItem.name,
        },
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

  getProducts(params?: { isActive?: boolean }) {
    return this.product.findMany({
      where: {
        isActive: params?.isActive,
        // ...(params?.isActive !== undefined && { isActive: params.isActive }),
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  private get product() {
    return this.prismaService.product;
  }
}

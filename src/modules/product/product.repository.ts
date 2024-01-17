import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { AddProductDto, GetProductsQueryDto } from '../../domain';
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

  private getProductsWhereClause(params?: GetProductsQueryDto) {
    const whereClause: Prisma.ProductWhereInput = {
      name: {
        contains: params?.withName,
        mode: 'insensitive',
      },
      isActive: params?.isActive,
    };
    return whereClause;
  }

  getProducts(params?: GetProductsQueryDto) {
    console.log('params', params?.withName);

    let skip = undefined;
    if (params?.cursor) {
      skip = 1;
    } else if (params?.skip) {
      skip = params.skip;
    }
    return this.product.findMany({
      skip: skip,
      take: params?.take,
      cursor: params?.cursor
        ? {
            id: params.cursor,
          }
        : undefined,
      // take: params?.take ? params.take : undefined,
      where: this.getProductsWhereClause(params),
      orderBy: {
        name: 'asc',
      },
    });
  }

  getProductsCount(params?: GetProductsQueryDto) {
    return this.product.count({
      where: this.getProductsWhereClause(params),
    });
  }

  private get product() {
    return this.prismaService.product;
  }
}

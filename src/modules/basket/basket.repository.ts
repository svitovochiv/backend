import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  CreateBasketDto,
  GetProductsInBasketQuery,
  UpdateBasketProductDto,
} from '../../domain';
import { GetBasketProductsDb } from './interface';

@Injectable()
export class BasketRepository {
  constructor(private readonly prismaService: PrismaService) {}

  updateOrCreateBasketProduct(updateBasketProductDto: UpdateBasketProductDto) {
    return this.basketProduct.upsert({
      where: {
        basketId_productId: {
          basketId: updateBasketProductDto.basketId,
          productId: updateBasketProductDto.productId,
        },
      },
      create: {
        basketId: updateBasketProductDto.basketId,
        productId: updateBasketProductDto.productId,
        count: updateBasketProductDto.count,
      },
      update: {
        count: updateBasketProductDto.count,
      },
    });
  }

  createBasketProduct(createBasketDto: CreateBasketDto) {
    return this.basket.create({
      data: {
        user: {
          connect: {
            id: createBasketDto.userId,
          },
        },
      },
    });
  }

  getBasketProductByUserId(userId: string) {
    return this.basket.findUnique({
      where: {
        userId,
      },
    });
  }

  getOrderedProductsMinimalInfoByUserId({ userId }: { userId: string }) {
    return this.basketProduct.findMany({
      where: {
        basket: {
          userId,
        },
      },
      select: {
        basketId: true,
        count: true,
        productId: true,
      },
    });
  }

  getBasketProducts({
    userId,
    isProductActive,
  }: GetProductsInBasketQuery): Promise<GetBasketProductsDb[]> {
    return this.basketProduct.findMany({
      orderBy: {
        product: {
          name: 'asc',
        },
      },
      where: {
        basket: {
          userId,
        },
        product: {
          ...(isProductActive !== undefined
            ? { isActive: isProductActive }
            : undefined),
        },
      },
      select: {
        basketId: true,
        count: true,
        productId: true,
        product: true,
      },
    });
  }

  deleteBasketProduct(data: { basketId: string; productId: string }) {
    return this.basketProduct.delete({
      where: {
        basketId_productId: {
          basketId: data.basketId,
          productId: data.productId,
        },
      },
    });
  }

  deleteBasket({ userId }: { userId: string }) {
    return this.basketProduct.deleteMany({
      where: {
        basket: {
          userId,
        },
      },
    });
  }

  private get basket() {
    return this.prismaService.basket;
  }
  private get basketProduct() {
    return this.prismaService.basketProduct;
  }
}

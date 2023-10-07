import { PrismaService } from '../prisma';
import { Injectable } from '@nestjs/common';
import { CreateBasketDto, UpdateBasketProductDto } from '../../domain';

@Injectable()
export class BasketRepository {
  constructor(private readonly prismaService: PrismaService) {}

  updateOrCreateBasketProduct(updateBasketProductDto: UpdateBasketProductDto) {
    console.log('updateBasketProductDto', updateBasketProductDto);
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
    console.log('createBasketDto', createBasketDto);
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

  private get basket() {
    return this.prismaService.basket;
  }
  private get basketProduct() {
    return this.prismaService.basketProduct;
  }
}

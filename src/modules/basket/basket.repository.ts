import { PrismaService } from '../prisma';
import { Injectable } from '@nestjs/common';
import { CreateBasketDto, UpdateBasketProductDto } from '../../domain';

@Injectable()
export class BasketRepository {
  constructor(private readonly prismaService: PrismaService) {}

  updateOrCreateBasketProduct(updateBasketProductDto: UpdateBasketProductDto) {
    return this.basketProduct.upsert({
      where: {
        basketId: updateBasketProductDto.basketId,
        productId: updateBasketProductDto.productId,
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

  getOrCreateBasket(createBasketDto: CreateBasketDto) {
    return this.basket.upsert({
      where: {
        userId: createBasketDto.userId,
      },
      create: {
        userId: createBasketDto.userId,
      },
      update: {},
    });
  }
  //
  // createBasketProduct(createBasketDto: CreateBasketDto) {
  //   return this.basket.create({
  //     data: {
  //       userId: createBasketDto.userId,
  //     },
  //   });
  // }
  //
  // getBasketProductByUserId(userId: string) {
  //   return this.basket.findUnique({
  //     where: {
  //       userId,
  //     },
  //   });
  // }

  private get basket() {
    return this.prismaService.basket;
  }
  private get basketProduct() {
    return this.prismaService.basketProduct;
  }
}

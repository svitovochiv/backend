import { BasketRepository } from './basket.repository';
import { Injectable } from '@nestjs/common';
import {
  BasketProductDto,
  CreateBasketDto,
  GetBasketByUserIdDto,
  UpdateBasketProductByUserIdDto,
  UpdateBasketProductDto,
} from '../../domain';

@Injectable()
export class BasketService {
  constructor(private readonly basketRepository: BasketRepository) {}

  async updateProduct(updateBasketProductDto: UpdateBasketProductByUserIdDto) {
    // validate
    const roundedCount = Math.round(updateBasketProductDto.count * 100) / 100;
    const validatedUpdateBasketProductDto = new UpdateBasketProductByUserIdDto({
      userId: updateBasketProductDto.userId,
      productId: updateBasketProductDto.productId,
      count: roundedCount,
    });

    const basket = await this.getOrCreateBasket(
      new CreateBasketDto({
        userId: validatedUpdateBasketProductDto.userId,
      }),
    );
    const savedBasketProduct =
      await this.basketRepository.updateOrCreateBasketProduct(
        new UpdateBasketProductDto({
          basketId: basket.id,
          productId: validatedUpdateBasketProductDto.productId,
          count: validatedUpdateBasketProductDto.count,
        }),
      );

    return new BasketProductDto({
      basketId: savedBasketProduct.basketId,
      productId: savedBasketProduct.productId,
      count: savedBasketProduct.count.toNumber(),
    });
  }

  async getOrCreateBasket(createBasketDto: CreateBasketDto) {
    const basket = await this.basketRepository.getBasketProductByUserId(
      createBasketDto.userId,
    );
    if (!basket) {
      return this.basketRepository.createBasketProduct(createBasketDto);
    }
    return basket;
  }

  async getOrderedProductsMinimalInfo(data: GetBasketByUserIdDto) {
    const productsInBasket =
      await this.basketRepository.getOrderedProductsMinimalInfoByUserId({
        userId: data.userId,
      });
    return productsInBasket.map(
      (product) =>
        new BasketProductDto({
          basketId: product.basketId,
          productId: product.productId,
          count: product.count.toNumber(),
        }),
    );
  }
}

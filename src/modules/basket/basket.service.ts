import { BasketRepository } from './basket.repository';
import { Injectable } from '@nestjs/common';
import {
  CreateBasketDto,
  GetBasketByUserIdDto,
  UpdateBasketProductByUserIdDto,
  UpdateBasketProductDto,
} from '../../domain';

@Injectable()
export class BasketService {
  constructor(private readonly basketRepository: BasketRepository) {}

  async updateProduct(updateBasketProductDto: UpdateBasketProductByUserIdDto) {
    const basket = await this.getOrCreateBasket(
      new CreateBasketDto({
        userId: updateBasketProductDto.userId,
      }),
    );
    return this.basketRepository.updateOrCreateBasketProduct(
      new UpdateBasketProductDto({
        basketId: basket.id,
        productId: updateBasketProductDto.productId,
        count: updateBasketProductDto.count,
      }),
    );
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

  getOrderedProductsMinimalInfo(data: GetBasketByUserIdDto) {
    return this.basketRepository.getOrderedProductsMinimalInfoByUserId({
      userId: data.userId,
    });
  }
}

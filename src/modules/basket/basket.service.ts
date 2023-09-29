import { BasketRepository } from './basket.repository';
import { Injectable } from '@nestjs/common';
import {
  CreateBasketDto,
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
  getOrCreateBasket(createBasketDto: CreateBasketDto) {
    return this.basketRepository.getOrCreateBasket(createBasketDto);
  }

  getOrderedProducts() {
    // return this.basketRepository.getOrderedProducts();
  }
}

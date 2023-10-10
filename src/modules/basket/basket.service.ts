import { BasketRepository } from './basket.repository';
import { Injectable } from '@nestjs/common';
import {
  BasketMinimalProductInfoDto,
  BasketSumDto,
  CreateBasketDto,
  GetBasketByUserIdDto,
  ProductsInBasketDto,
  Quantity,
  SubmitBasket,
  UpdateBasketProductByUserIdDto,
  UpdateBasketProductDto,
} from '../../domain';
import { DeleteProductInBasketDto } from '../../domain/order/dto/delete-product-in-basket.dto';
import { QuantityUtil } from '../../util';

@Injectable()
export class BasketService {
  private readonly quantityUtil = new QuantityUtil();
  constructor(private readonly basketRepository: BasketRepository) {}

  async deleteProduct(deleteProductDto: DeleteProductInBasketDto) {
    const basket = await this.basketRepository.getBasketProductByUserId(
      deleteProductDto.userId,
    );
    if (basket) {
      await this.basketRepository.deleteBasketProduct({
        productId: deleteProductDto.productId,
        basketId: basket.id,
      });
    }
  }

  async updateProduct(updateBasketProductDto: UpdateBasketProductByUserIdDto) {
    if (!updateBasketProductDto.count) {
      return await this.deleteProduct(
        new DeleteProductInBasketDto({
          productId: updateBasketProductDto.productId,
          userId: updateBasketProductDto.userId,
        }),
      );
    } else {
      updateBasketProductDto.count =
        Math.round(updateBasketProductDto.count * 100) / 100;

      const basket = await this.getOrCreateBasket(
        new CreateBasketDto({
          userId: updateBasketProductDto.userId,
        }),
      );
      const savedBasketProduct =
        await this.basketRepository.updateOrCreateBasketProduct(
          new UpdateBasketProductDto({
            basketId: basket.id,
            productId: updateBasketProductDto.productId,
            count: updateBasketProductDto.count,
          }),
        );

      return new BasketMinimalProductInfoDto({
        basketId: savedBasketProduct.basketId,
        productId: savedBasketProduct.productId,
        count: savedBasketProduct.count.toNumber(),
      });
    }
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
        new BasketMinimalProductInfoDto({
          basketId: product.basketId,
          productId: product.productId,
          count: product.count.toNumber(),
        }),
    );
  }

  async getOrderedProductsSum(data: GetBasketByUserIdDto) {
    const productsInBasket =
      await this.basketRepository.getOrderedProductsUserId({
        userId: data.userId,
      });
    const sum = productsInBasket.reduce((acc, product) => {
      const count = product.count.toNumber();
      const price = product.product.price;
      const sum = count * price;
      return acc + sum;
    }, 0);

    return new BasketSumDto({
      sum,
    });
  }

  async getProductsInBasket(data: GetBasketByUserIdDto) {
    const savedProductsInBasket =
      await this.basketRepository.getOrderedProductsUserId({
        userId: data.userId,
      });
    return savedProductsInBasket.map((productInBasket) => {
      const quantity =
        this.quantityUtil.normalizeQuantity(productInBasket.product.quantity) ||
        Quantity.Kilogram;
      let sum =
        productInBasket.count.toNumber() * productInBasket.product.price;
      sum = Math.round(sum * 100) / 100;
      return new ProductsInBasketDto({
        name: productInBasket.product.name,
        productId: productInBasket.productId,
        count: productInBasket.count.toNumber(),
        price: productInBasket.product.price,
        sum,
        quantity,
      });
    });
  }

  submitBasket(data: SubmitBasket) {
    return this.basketRepository.submitBasket(data);
  }
}

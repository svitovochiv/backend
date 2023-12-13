import { BasketRepository } from './basket.repository';
import { Injectable } from '@nestjs/common';
import {
  BasketMinimalProductInfoDto,
  BasketSumDto,
  CountAndPrice,
  CreateBasketDto,
  GetBasketByUserIdDto,
  ProductsInBasketDto,
  Quantity,
  UpdateBasketProductByUserIdDto,
  UpdateBasketProductDto,
} from '../../domain';
import { DeleteProductInBasketDto } from '../../domain/order/dto/delete-product-in-basket.dto';
import { QuantityUtil } from '../../util';
import { ProductFinancialCalculatorService } from '../product-financical-calculator';

@Injectable()
export class BasketService {
  private readonly quantityUtil = new QuantityUtil();
  constructor(
    private readonly basketRepository: BasketRepository,
    private readonly sumAggregatorService: ProductFinancialCalculatorService,
  ) {}

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
      // updateBasketProductDto.count =
      updateBasketProductDto.count = this.sumAggregatorService.normalizeCount(
        updateBasketProductDto.count,
      );

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
        count: savedBasketProduct.count,
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
          count: product.count,
        }),
    );
  }

  async getOrderedProductsSum(data: GetBasketByUserIdDto) {
    const productsInBasket = await this.basketRepository.getBasketProducts({
      userId: data.userId,
    });
    const formattedProductsInBasket: CountAndPrice[] = productsInBasket.map(
      (product) => {
        return {
          count: product.count,
          price: product.product.price,
        };
      },
    );
    const sum = this.sumAggregatorService.calculateProductsCost(
      formattedProductsInBasket,
    );

    return new BasketSumDto({
      sum,
    });
  }

  async getProductsInBasket(data: GetBasketByUserIdDto) {
    const savedProductsInBasket = await this.basketRepository.getBasketProducts(
      {
        userId: data.userId,
      },
    );
    return savedProductsInBasket.map((productInBasket) => {
      const quantity =
        this.quantityUtil.normalizeQuantity(productInBasket.product.quantity) ||
        Quantity.Kilogram;
      const sum = this.sumAggregatorService.calculateProductCost({
        count: productInBasket.count,
        price: productInBasket.product.price,
      });
      return new ProductsInBasketDto({
        name: productInBasket.product.name,
        productId: productInBasket.productId,
        count: productInBasket.count,
        price: productInBasket.product.price,
        sum,
        quantity,
      });
    });
  }

  deleteBasketByUserId(data: { userId: string }) {
    return this.basketRepository.deleteBasket(data);
  }
}

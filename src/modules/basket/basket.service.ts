import { Injectable } from '@nestjs/common';
import {
  BasketMinimalProductInfoDto,
  BasketProductWithProductDto,
  BasketProductWithPriceDto,
  BasketSumDto,
  CreateBasketDto,
  GetProductsInBasketQuery,
  ProductsInBasketDto,
  UpdateBasketProductByUserIdDto,
  UpdateBasketProductDto,
  ProductDto,
  Quantity,
} from '../../domain';
import { DeleteProductInBasketDto } from '../../domain/order/dto/delete-product-in-basket.dto';
import { QuantityUtil } from '../../util';
import { ProductFinancialCalculatorService } from '../product-financical-calculator';
import { ProductDbToDtoMapper } from '../../util/mapper';
import { BasketRepository } from './basket.repository';

@Injectable()
export class BasketService {
  private quantityUtil = new QuantityUtil();
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

  async getOrderedProductsMinimalInfo(data: GetProductsInBasketQuery) {
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
  private formatActiveProducts(
    basketProducts: BasketProductWithProductDto[],
  ): BasketProductWithPriceDto[] {
    return basketProducts
      .filter((basketProduct) => basketProduct.product.isActive)
      .map(
        (basketProduct) =>
          new BasketProductWithPriceDto({
            ...basketProduct,
            price: basketProduct.product.price,
          }),
      );
  }
  async getOrderedProductsSum(data: GetProductsInBasketQuery) {
    const savedBasketProductsWithProduct =
      await this.basketRepository.getBasketProducts({
        userId: data.userId,
      });

    const basketProductsWithProduct = savedBasketProductsWithProduct.map(
      (savedBasketProductWithProduct) =>
        new BasketProductWithProductDto({
          basketId: savedBasketProductWithProduct.basketId,
          productId: savedBasketProductWithProduct.productId,
          count: savedBasketProductWithProduct.count,
          product: new ProductDto(
            ProductDbToDtoMapper.productDbToDto(
              savedBasketProductWithProduct.product,
            ),
          ),
        }),
    );

    const formattedProductsInBasket = this.formatActiveProducts(
      basketProductsWithProduct,
    );

    const sum = this.sumAggregatorService.calculateProductsCost(
      formattedProductsInBasket,
    );
    return new BasketSumDto({
      sum,
    });
  }

  async getProductsInBasket(query: GetProductsInBasketQuery) {
    const savedProductsInBasket = await this.basketRepository.getBasketProducts(
      query,
    );
    return savedProductsInBasket.map((productInBasket) => {
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
        quantity: new Quantity(productInBasket.product.quantity),
        isActive: productInBasket.product.isActive,
      });
    });
  }

  deleteBasketByUserId(data: { userId: string }) {
    return this.basketRepository.deleteBasket(data);
  }
}

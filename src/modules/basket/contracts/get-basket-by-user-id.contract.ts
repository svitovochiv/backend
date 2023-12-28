import { ProductsInBasketDto } from '../../../domain';

export class GetBasketByUserIdContract {
  productsInBasket: {
    productId: string;
    count: number;
    quantity: string;
    price: number;
    name: string;
    sum: number;
    isActive: boolean;
  }[];

  constructor(data: GetBasketByUserIdContract) {
    this.productsInBasket = data.productsInBasket;
  }

  static fromProductsInBasketDto(
    getBasketProductsResponse: ProductsInBasketDto[],
  ): GetBasketByUserIdContract {
    return new GetBasketByUserIdContract({
      productsInBasket: getBasketProductsResponse.map((product) => ({
        productId: product.productId,
        count: product.count,
        quantity: product.quantity.value,
        price: product.price,
        name: product.name,
        sum: product.sum,
        isActive: product.isActive,
      })),
    });
  }
}

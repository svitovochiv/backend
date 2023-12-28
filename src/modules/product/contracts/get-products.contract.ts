import { ProductDto } from '../../../domain';

export class GetProductsContractRes {
  products: {
    id: string;
    name: string;
    price: number;
    quantity: string;
    isActive: boolean;
  }[];

  constructor(getProductsContractRes: GetProductsContractRes) {
    this.products = getProductsContractRes.products;
  }

  static fromProducts(products: ProductDto[]) {
    return new GetProductsContractRes({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity.value,
        isActive: product.isActive,
      })),
    });
  }
}

import { BasketProduct, Product } from '@prisma/client';

export type GetBasketProductsDb = Pick<
  BasketProduct,
  'productId' | 'basketId' | 'count'
> & {
  product: Pick<Product, 'id' | 'name' | 'price' | 'quantity'>;
};

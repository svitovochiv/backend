import { OrderedProduct, Product } from '@prisma/client';

export type OrderedProductWithProductDb = {
  product: Product;
} & OrderedProduct;

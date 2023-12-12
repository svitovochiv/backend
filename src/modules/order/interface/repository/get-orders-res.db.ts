import { ShippingDetails, Order } from '@prisma/client';
import { OrderedProductWithProductDb } from './ordered-product-with-product.db';

export type GetOrderResDb = {
  ShippingDetails: ShippingDetails;
  OrderedProduct: OrderedProductWithProductDb[];
} & Order;

import {
  OrderedProduct,
  Product,
  ShippingDetails,
  Order,
} from '@prisma/client';

export type GetOrderResDb = {
  ShippingDetails: ShippingDetails;
  OrderedProduct: ({
    product: Product;
  } & OrderedProduct)[];
} & Order;

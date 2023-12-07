import { OrderStatus } from '../order-status';
import { PaymentMethod } from '../payment-method';
import { OrderedProductDto } from './ordered-product.dto';
import { OrderedProductWithSumDto } from './ordered-product-with-sum.dto';

export class FullOrderInfoDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: string;
  totalPrice: number;
  recipient: string;
  contactNumber: string;
  orderedProducts: OrderedProductWithSumDto[];

  constructor(data: FullOrderInfoDto) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.status = data.status;
    this.paymentMethod = data.paymentMethod;
    this.totalPrice = data.totalPrice;
    this.address = data.address;
    this.recipient = data.recipient;
    this.contactNumber = data.contactNumber;
    this.orderedProducts = data.orderedProducts;
  }
}

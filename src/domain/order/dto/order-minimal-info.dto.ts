import { OrderStatus } from '../order-status';
import { PaymentMethod } from '../payment-method';

export class OrderMinimalInfoDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: string;
  totalPrice: number;

  constructor(data: OrderMinimalInfoDto) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.status = data.status;
    this.paymentMethod = data.paymentMethod;
    this.totalPrice = data.totalPrice;
    this.address = data.address;
  }
}

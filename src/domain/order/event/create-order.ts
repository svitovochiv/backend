import { OrderStatus } from '../order-status';

export class CreateOrder {
  userId: string;
  shippingDetailsId: string;
  orderStatus: OrderStatus = OrderStatus.CREATED;

  constructor(data: Omit<CreateOrder, 'orderStatus'>) {
    this.userId = data.userId;
    this.shippingDetailsId = data.shippingDetailsId;
  }
}

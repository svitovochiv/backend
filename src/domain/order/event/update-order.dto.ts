export class UpdateOrderDto {
  orderId: string;
  orderStatus?: string;

  constructor(dara: UpdateOrderDto) {
    this.orderId = dara.orderId;
    this.orderStatus = dara.orderStatus;
  }
}

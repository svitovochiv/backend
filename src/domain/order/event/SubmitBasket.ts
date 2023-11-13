import { ShippingDetails } from '../dto';

export class SubmitBasket {
  userId: string;
  shippingDetails: ShippingDetails;
  constructor(data: SubmitBasket) {
    this.userId = data.userId;
    this.shippingDetails = data.shippingDetails;
  }
}

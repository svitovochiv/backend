import { PaymentMethod } from '../payment-method';

export class ShippingDetails {
  userId: string;
  address: string;
  number: string;
  firstName: string;
  lastName: string;
  paymentMethod: PaymentMethod;

  constructor(data: ShippingDetails) {
    this.userId = data.userId;
    this.address = data.address;
    this.number = data.number;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.paymentMethod = data.paymentMethod;
  }
}

import { IsEnum } from 'class-validator';
import { PaymentMethod } from '../payment-method';

export class ReqShippingDetails {
  firstName!: string;
  lastName!: string;
  address!: string;
  number!: string;
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}

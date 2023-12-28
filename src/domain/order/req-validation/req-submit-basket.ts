import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReqShippingDetails } from './req-shipping-details';

export class ReqSubmitBasket {
  @ValidateNested()
  @Type(() => ReqShippingDetails)
  shippingDetails!: ReqShippingDetails;
}

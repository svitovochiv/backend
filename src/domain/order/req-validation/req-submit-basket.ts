import { ReqShippingDetails } from './req-shipping-details';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReqSubmitBasket {
  @ValidateNested()
  @Type(() => ReqShippingDetails)
  shippingDetails!: ReqShippingDetails;
}

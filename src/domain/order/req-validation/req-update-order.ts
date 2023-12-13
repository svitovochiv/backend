import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../order-status';

export class ReqUpdateOrder {
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  orderStatus?: OrderStatus;
}

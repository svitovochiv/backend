import { OmitType } from '@nestjs/mapped-types';
import { UpdateBasketProductByUserIdDto } from '../update-basket-product-by-userId.dto';

export class ReqUpdateBasketProductByUserIdDto extends OmitType(
  UpdateBasketProductByUserIdDto,
  [],
) {}

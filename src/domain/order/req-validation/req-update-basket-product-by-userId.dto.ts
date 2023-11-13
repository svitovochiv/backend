import { OmitType } from '@nestjs/mapped-types';
import { UpdateBasketProductByUserIdDto } from '../dto';

export class ReqUpdateBasketProductByUserIdDto extends OmitType(
  UpdateBasketProductByUserIdDto,
  [],
) {}

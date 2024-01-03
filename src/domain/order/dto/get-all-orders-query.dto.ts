import { OrderStatus } from '../order-status';
import { SortDateType } from '../../date';

export class GetAllOrdersQueryDto {
  withUserId?: string;
  withStatus?: OrderStatus;
  sortByCreatedAtDate?: SortDateType;

  constructor(getAllOrdersQueryDto: GetAllOrdersQueryDto) {
    this.withUserId = getAllOrdersQueryDto.withUserId;
    this.withStatus = getAllOrdersQueryDto.withStatus;
    this.sortByCreatedAtDate = getAllOrdersQueryDto.sortByCreatedAtDate;
  }
}

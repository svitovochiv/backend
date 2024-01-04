import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, SortDateType } from '../../../domain';

export class GetAllOrdersContractRes {
  @ApiProperty({
    example: '5f9d7a3e-9f8d-4b0a-8b9a-9b0b4b9c0b9c',
    type: String,
  })
  @IsString()
  @IsOptional()
  withUserId?: string;
  @ApiProperty({
    example: OrderStatus.CREATED,
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  withStatus?: OrderStatus;

  @ApiProperty({
    example: SortDateType.ASC,
    enum: SortDateType,
  })
  @IsEnum(SortDateType)
  @IsOptional()
  sortByCreatedAtDate?: SortDateType;
}

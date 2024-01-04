import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CSession, Session } from '../auth';
import {
  GetAllOrdersQueryDto,
  GetOrderDto,
  ReqSubmitBasket,
  ReqUpdateOrder,
  ShippingDetails,
  SubmitBasket,
  UpdateOrderDto,
} from '../../domain';
import { OrderService } from './order.service';
import { GetAllOrdersContractRes } from './contracts/get-all-orders.contract';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('submit')
  @UseGuards(new AuthGuard())
  submitBasket(
    @Session() session: CSession,
    @Body() submitBasket: ReqSubmitBasket,
  ) {
    const userId = session.getAccessTokenPayload().appUserId;
    return this.orderService.submitBasket(
      new SubmitBasket({
        userId,
        shippingDetails: new ShippingDetails({
          userId,
          address: submitBasket.shippingDetails.address,
          number: submitBasket.shippingDetails.number,
          firstName: submitBasket.shippingDetails.firstName,
          lastName: submitBasket.shippingDetails.lastName,
          paymentMethod: submitBasket.shippingDetails.paymentMethod,
        }),
      }),
    );
  }

  @Get()
  @UseGuards(new AuthGuard())
  getUserOrders(@Session() session: CSession) {
    const userId = session.getAccessTokenPayload().appUserId;
    return this.orderService.getOrders({ withUserId: userId });
  }

  @Get('all')
  getAllOrders(@Query() getAllOrdersQueryDto: GetAllOrdersContractRes) {
    console.log(getAllOrdersQueryDto);
    return this.orderService.getOrders(
      new GetAllOrdersQueryDto(getAllOrdersQueryDto),
    );
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  getOrderById(@Session() session: CSession, @Param('id') id: string) {
    return this.orderService.getOrderById(new GetOrderDto({ id }));
  }

  @Put('/update')
  @UseGuards(new AuthGuard())
  updateOrder(@Body() updateOrder: ReqUpdateOrder) {
    return this.orderService.updateOrder(new UpdateOrderDto(updateOrder));
  }
}

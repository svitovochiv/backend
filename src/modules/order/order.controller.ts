import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CSession, Session } from '../auth';
import {
  GetOrderDto,
  ReqSubmitBasket,
  ReqUpdateOrder,
  ShippingDetails,
  SubmitBasket,
  UpdateOrderDto,
} from '../../domain';
import { OrderService } from './order.service';

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
    return this.orderService.getAllOrders({ userId });
  }

  @Get('all')
  getAllOrders() {
    return this.orderService.getAllOrders();
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

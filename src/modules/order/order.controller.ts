import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, CSession, Session } from '../auth';
import { ReqSubmitBasket, ShippingDetails, SubmitBasket } from '../../domain';
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
    return this.orderService.submitOrder(
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
    return this.orderService.getOrdersByUserId({ userId });
  }

  @Get('all')
  @UseGuards(new AuthGuard())
  getAllOrders() {
    return this.orderService.getAllOrders();
  }
}

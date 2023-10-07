import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ReqUpdateBasketProductByUserIdDto } from '../../domain/order/dto/req-validation/req-update-basket-product-by-userId.dto';
import { AuthGuard, CSession, Session } from '../auth';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Put('product')
  updateBasketProduct(
    @Body() updateBasketProductDto: ReqUpdateBasketProductByUserIdDto,
  ) {
    return this.basketService.updateProduct(updateBasketProductDto);
  }

  @Get('minimal-info')
  @UseGuards(new AuthGuard())
  getOrderedProducts(@Session() session: CSession) {
    const userId = session.getAccessTokenPayload().appUserId;
    return this.basketService.getOrderedProductsMinimalInfo({
      userId,
    });
  }

  @Get('sum')
  @UseGuards(new AuthGuard())
  getOrderedProductsSum(@Session() session: CSession) {
    const userId = session.getAccessTokenPayload().appUserId;
    return this.basketService.getOrderedProductsSum({
      userId,
    });
  }
}

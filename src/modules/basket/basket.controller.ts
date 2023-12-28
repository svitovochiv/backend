import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard, CSession, Session } from '../auth';
import { ReqUpdateBasketProductByUserIdDto } from '../../domain';
import { BasketService } from './basket.service';
import { GetBasketByUserIdContract } from './contracts';

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

  @Get('products')
  @UseGuards(new AuthGuard())
  async getBasketByUserId(
    @Session() session: CSession,
  ): Promise<GetBasketByUserIdContract> {
    const userId = session.getAccessTokenPayload().appUserId;
    const productsInBasket = await this.basketService.getProductsInBasket({
      userId,
    });
    return GetBasketByUserIdContract.fromProductsInBasketDto(productsInBasket);
  }
}

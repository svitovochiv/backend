import { Body, Controller, Get, Put } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ReqUpdateBasketProductByUserIdDto } from '../../domain/order/dto/req-validation/req-update-basket-product-by-userId.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Put('product')
  updateBasketProduct(
    @Body() updateBasketProductDto: ReqUpdateBasketProductByUserIdDto,
  ) {
    console.log('updateBasketProductDto', updateBasketProductDto.productId);
    return this.basketService.updateProduct(updateBasketProductDto);
  }

  @Get()
  getOrderedProducts() {
    return this.basketService.getOrderedProducts();
  }
}

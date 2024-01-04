import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { OrderRepository } from '../../src/modules/order/order.repository';
import { OrderService } from '../../src/modules';
import {
  ProductFinancialCalculatorModule,
  ProductFinancialCalculatorService,
} from '../../src/modules/product-financical-calculator';
import { PrismaModule } from '../../src/modules/prisma';
import { BasketModule } from '../../src/modules/basket';
import {
  GetAllOrdersQueryDto,
  OrderMinimalInfoDto,
  OrderStatus,
  SortDateType,
} from '../../src/domain';
import { TestUtil } from '../../src/util';

describe('get orders', () => {
  let orderService: OrderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, ProductFinancialCalculatorModule, BasketModule],
      providers: [
        OrderService,
        OrderRepository,
        ProductFinancialCalculatorService,
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
  });

  describe('check order filtering', () => {
    const statusToCheck = TestUtil.getRandomValue(Object.values(OrderStatus));
    let orders: OrderMinimalInfoDto[];
    beforeEach(async () => {
      const createdOrders = await orderService.getOrders(
        new GetAllOrdersQueryDto({
          withStatus: statusToCheck,
          sortByCreatedAtDate: SortDateType.ASC,
        }),
      );
      orders = TestUtil.getRandomObjects(createdOrders, 2);
    });

    test(`should return orders with status "${statusToCheck}"`, () => {
      orders.forEach((order) => {
        expect(order.status).toEqual(statusToCheck);
      });
    });
  });
});

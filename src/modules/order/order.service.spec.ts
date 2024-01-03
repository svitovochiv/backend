import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import {
  ProductFinancialCalculatorModule,
  ProductFinancialCalculatorService,
} from '../product-financical-calculator';
import { PrismaModule } from '../prisma';
import { BasketModule } from '../basket';
import { OrderDataGenerator } from '../../test-helper';
import { OrderStatus } from '../../domain';
import { OrderDbToDtoMapper } from '../../util/mapper';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { GetOrderResDb } from './interface';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: OrderRepository;
  let financialCalculatorService: ProductFinancialCalculatorService;

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
    orderRepository = module.get<OrderRepository>(OrderRepository);
    financialCalculatorService = module.get<ProductFinancialCalculatorService>(
      ProductFinancialCalculatorService,
    );
  });

  test('should calculate the correct sum for all orders', async () => {
    const createdOrder =
      OrderDataGenerator.orderWithShippingDetailsAndOrderedProducts({
        orderStatus: OrderStatus.DELIVERED,
      });
    const deliveredOrder = OrderDataGenerator.changeOrderStatus({
      order: createdOrder,
      orderStatus: OrderStatus.CREATED,
    });

    const mockOrdersWithTotalPrice: GetOrderResDb[] = [
      deliveredOrder,
      createdOrder,
    ];

    jest
      .spyOn(orderRepository, 'getOrders')
      .mockImplementation(() => Promise.resolve(mockOrdersWithTotalPrice));

    const orderedDeliveredProductWithProductDto =
      OrderDbToDtoMapper.ItemGetOrderToOrderedProductsWithProduct(
        deliveredOrder,
      );
    const orderedCreatedProductWithProductDto =
      OrderDbToDtoMapper.ItemGetOrderToOrderedProductsWithProduct(createdOrder);

    const calculatedTotalPriceWithCreatedStatus =
      financialCalculatorService.getSumOrderedProducts(
        orderedCreatedProductWithProductDto,
        OrderStatus.CREATED,
      );

    const calculatedTotalPriceWithDeliveredStatus =
      financialCalculatorService.getSumOrderedProducts(
        orderedDeliveredProductWithProductDto,
        OrderStatus.DELIVERED,
      );

    const orders = await orderService.getOrders();
    const testDeliveredOrder = orders.find(
      (order) => order.status === OrderStatus.DELIVERED,
    );

    const testCreatedOrder = orders.find(
      (order) => order.status === OrderStatus.CREATED,
    );
    expect(testDeliveredOrder).toBeDefined();
    expect(testCreatedOrder).toBeDefined();

    if (testDeliveredOrder) {
      expect(testDeliveredOrder.totalPrice).toEqual(
        calculatedTotalPriceWithDeliveredStatus,
      );
    }
    if (testCreatedOrder) {
      expect(testCreatedOrder.totalPrice).toEqual(
        calculatedTotalPriceWithCreatedStatus,
      );
    }
    if (testDeliveredOrder && testCreatedOrder) {
      expect(testDeliveredOrder.totalPrice).not.toEqual(
        testCreatedOrder.totalPrice,
      );
    }
  });
});

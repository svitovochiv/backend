import { Test } from '@nestjs/testing';
import { CountAndPrice, OrderStatus } from '../../domain';
import {
  OrderDataGenerator,
  ProductFinancialGenerator,
} from '../../test-helper';
import { OrderDbToDtoMapper } from '../../util/mapper';
import { ProductFinancialCalculatorService } from './product-financical-calculator.service';

describe('ProductFinancialCalculatorService', () => {
  let financialCalculatorService: ProductFinancialCalculatorService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductFinancialCalculatorService],
      exports: [ProductFinancialCalculatorService],
    }).compile();

    financialCalculatorService = module.get<ProductFinancialCalculatorService>(
      ProductFinancialCalculatorService,
    );
  });

  describe('sumOrderedProducts method', () => {
    it('should correctly calculate the sum of ordered products', () => {
      const countAndPrice: CountAndPrice =
        ProductFinancialGenerator.priceAndCount();
      const expectedSum =
        Math.round(countAndPrice.count * countAndPrice.price * 100) / 100;
      const sum =
        financialCalculatorService.calculateProductCost(countAndPrice);

      expect(sum).toEqual(expectedSum);
    });
  });

  describe('getSumOrderedProducts method', () => {
    it('should calculate total cost of all products', () => {
      const createdOrder =
        OrderDataGenerator.orderWithShippingDetailsAndOrderedProducts({
          orderStatus: OrderStatus.CREATED,
        });
      const orderedCreatedProductWithProductDto =
        OrderDbToDtoMapper.ItemGetOrderToOrderedProductsWithProduct(
          createdOrder,
        );

      const totalCreatedCost = financialCalculatorService.getSumOrderedProducts(
        orderedCreatedProductWithProductDto,
        OrderStatus.CREATED,
      );

      const wrongTotalDeliveredCost =
        financialCalculatorService.getSumOrderedProducts(
          orderedCreatedProductWithProductDto,
          OrderStatus.DELIVERED,
        );

      expect(wrongTotalDeliveredCost).not.toBe(totalCreatedCost);
    });
  });
});

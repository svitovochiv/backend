import { Test, TestingModule } from '@nestjs/testing';
import { BasketService } from './basket.service';
import { BasketRepository } from './basket.repository';
import { PrismaModule } from '../prisma';
import { ProductFinancialCalculatorService } from '../product-financical-calculator';
import { BasketDataGenerator } from '../../test-helper';
import { CountAndPrice } from '../../domain';

describe('BasketService', () => {
  let basketService: BasketService;
  let basketRepository: BasketRepository;
  let financialCalculatorService: ProductFinancialCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        BasketRepository,
        ProductFinancialCalculatorService,
        BasketService,
      ],
    }).compile();

    basketService = module.get<BasketService>(BasketService);
    basketRepository = module.get<BasketRepository>(BasketRepository);
    financialCalculatorService = module.get<ProductFinancialCalculatorService>(
      ProductFinancialCalculatorService,
    );
  });

  describe('getBasketProductsMinimalInfo', () => {
    let pack1: ReturnType<typeof BasketDataGenerator.basketOfUser>;
    let pack2: ReturnType<typeof BasketDataGenerator.basketOfUser>;

    beforeEach(() => {
      pack1 = BasketDataGenerator.basketOfUser();
      pack2 = BasketDataGenerator.basketOfUser();
      const basketProductsWithProduct = [
        pack1.basketProductsWithProduct,
        pack2.basketProductsWithProduct,
      ].flat();
      const mockBaskets = [pack1.basket, pack2.basket];
      jest
        .spyOn(basketRepository, 'getBasketProducts')
        .mockImplementation(({ userId }) =>
          Promise.resolve(
            basketProductsWithProduct.filter((basketProduct) => {
              const basket = mockBaskets.find(
                (basket) => basket.userId === userId,
              );
              return basketProduct.basketId === basket?.id;
            }),
          ),
        );
    });

    it('should return basket products with product', async () => {
      // prepare data for assertion
      const formattedProductsInBasketPack1: CountAndPrice[] =
        pack1.basketProductsWithProduct
          .filter((basketProduct) => basketProduct.product.isActive)
          .map((product) => {
            return {
              count: product.count,
              price: product.product.price,
            };
          });

      const expectedBasketSumDtoPack1 =
        financialCalculatorService.calculateProductsCost(
          formattedProductsInBasketPack1,
        );

      // request data
      const basketSumDtoPack1 = await basketService.getOrderedProductsSum({
        userId: pack1.client.id,
      });
      const basketSumDtoPack2 = await basketService.getOrderedProductsSum({
        userId: pack2.client.id,
      });

      // assert
      expect(basketSumDtoPack1.sum).toBe(expectedBasketSumDtoPack1);
      expect(basketSumDtoPack2.sum).not.toBe(expectedBasketSumDtoPack1);
    });
  });

  // Test cases go here
});

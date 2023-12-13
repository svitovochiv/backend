import { Test, TestingModule } from '@nestjs/testing';
import { BasketService } from './basket.service';
import { BasketRepository } from './basket.repository';
import { PrismaModule } from '../prisma';
import { ProductFinancialCalculatorService } from '../product-financical-calculator';

describe('BasketService', () => {
  let basketService: BasketService;
  let basketRepository: BasketRepository;

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
  });

  describe('getBasketProductsMinimalInfo', () => {

  });

  // Test cases go here
});

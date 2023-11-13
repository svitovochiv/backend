import { Global, Module } from '@nestjs/common';
import { ProductFinancialCalculatorService } from './product-financical-calculator.service';

@Global()
@Module({
  providers: [ProductFinancialCalculatorService],
  exports: [ProductFinancialCalculatorService],
})
export class ProductFinancialCalculatorModule {}

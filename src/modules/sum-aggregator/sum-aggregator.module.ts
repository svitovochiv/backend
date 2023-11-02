import { Global, Module } from '@nestjs/common';
import { SumAggregatorService } from './sum-aggregator.service';

@Global()
@Module({
  providers: [SumAggregatorService],
  exports: [SumAggregatorService],
})
export class SumAggregatorModule {}

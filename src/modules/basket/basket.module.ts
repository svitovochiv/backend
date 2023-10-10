import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { BasketRepository } from './basket.repository';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';

@Module({
  imports: [PrismaModule],
  providers: [BasketRepository, BasketService],
  controllers: [BasketController],
  exports: [BasketService],
})
export class BasketModule {}

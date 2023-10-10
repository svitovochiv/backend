import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { BasketModule } from '../basket';

@Module({
  imports: [PrismaModule, BasketModule],
  providers: [OrderRepository, OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

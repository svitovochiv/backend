import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { BasketModule } from '../basket';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [PrismaModule, BasketModule],
  providers: [OrderRepository, OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

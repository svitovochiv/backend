import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

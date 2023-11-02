import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserReadRepository } from './user-read.repository';
import { UserReadService } from './user-read.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [UserReadRepository, UserReadService],
  exports: [UserReadService],
})
export class UserReadModule {}
